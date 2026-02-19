import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import MonthlyCalendar from '../components/calendar/MonthlyCalendar.jsx';
import YearlyCalendar from '../components/calendar/YearlyCalendar.jsx';
import DateRangeCalendar from '../components/calendar/DateRangeCalendar.jsx';
import CalendarExport from '../components/calendar/CalendarExport.jsx';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyCalendar, getYearlyCalendar, getDateRangeCalendar } from '../services/prayerTimesService.js';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { CALENDAR_VIEWS } from '../utils/constants.js';
import { gregorianToHijri } from '../utils/hijri.js';

/**
 * Calculate the Gregorian start and end dates for the current Hijri month
 * that contains the given base date.
 */
function getCurrentHijriMonthRange(baseDate = new Date()) {
  const targetHijri = gregorianToHijri(baseDate);

  // Find start of Hijri month (Hijri day === 1)
  let start = new Date(baseDate);
  for (let i = 0; i < 35; i++) {
    const h = gregorianToHijri(start);
    if (h.year === targetHijri.year && h.month === targetHijri.month && h.day === 1) {
      break;
    }
    start.setDate(start.getDate() - 1);
  }

  // Find end of Hijri month (last day before month/year changes)
  let end = new Date(baseDate);
  for (let i = 0; i < 35; i++) {
    const h = gregorianToHijri(end);
    if (h.year !== targetHijri.year || h.month !== targetHijri.month) {
      // Step back one day to stay within the target Hijri month
      end.setDate(end.getDate() - 1);
      break;
    }
    end.setDate(end.getDate() + 1);
  }

  // Safety: ensure start is not after end
  if (start > end) {
    end = new Date(start);
  }

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
  };
}

export default function Calendar() {
  const { location, method, language } = useApp();
  const [searchParams] = useSearchParams();

  const initialView = (() => {
    const view = searchParams.get('view');
    if (view === CALENDAR_VIEWS.MONTHLY || view === CALENDAR_VIEWS.YEARLY || view === CALENDAR_VIEWS.DATE_RANGE) {
      return view;
    }
    // Default: show current Hijri (Islamic) month as a date-range view
    return CALENDAR_VIEWS.DATE_RANGE;
  })();

  const now = new Date();
  const { startDate: hijriStart, endDate: hijriEnd } = getCurrentHijriMonthRange(now);
  const initialYear = (() => {
    const yearParam = searchParams.get('year');
    const parsed = yearParam ? parseInt(yearParam, 10) : NaN;
    return Number.isNaN(parsed) ? now.getFullYear() : parsed;
  })();

  const initialMonth = (() => {
    const monthParam = searchParams.get('month');
    const parsed = monthParam ? parseInt(monthParam, 10) : NaN;
    const monthValue = Number.isNaN(parsed) ? now.getMonth() + 1 : parsed;
    return Math.min(Math.max(monthValue, 1), 12);
  })();

  const initialStartDate = searchParams.get('startDate') || hijriStart;
  const initialEndDate = searchParams.get('endDate') || hijriEnd;

  const [viewType, setViewType] = useState(initialView);
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch data based on view type
  const { data: monthlyData } = useQuery({
    queryKey: ['monthly-calendar', location.lat, location.lng, year, month, method, 'sunset_adj_29'],
    queryFn: () => getMonthlyCalendar(location.lat, location.lng, year, month, method, true, { sunset_adjustment: 29 }),
    enabled: viewType === CALENDAR_VIEWS.MONTHLY && !!location.lat && !!location.lng,
  });

  const { data: yearlyData } = useQuery({
    queryKey: ['yearly-calendar', location.lat, location.lng, year, method, 'summary', 'sunset_adj_29'],
    queryFn: () => getYearlyCalendar(location.lat, location.lng, year, method, 'summary', true, { sunset_adjustment: 29 }),
    enabled: viewType === CALENDAR_VIEWS.YEARLY && !!location.lat && !!location.lng,
  });

  const { data: dateRangeData } = useQuery({
    queryKey: ['date-range-calendar', location.lat, location.lng, startDate, endDate, method, 'sunset_adj_29'],
    queryFn: () => getDateRangeCalendar(location.lat, location.lng, startDate, endDate, method, true, { sunset_adjustment: 29 }),
    enabled: viewType === CALENDAR_VIEWS.DATE_RANGE && !!location.lat && !!location.lng && !!startDate && !!endDate,
  });

  const getCurrentData = () => {
    switch (viewType) {
      case CALENDAR_VIEWS.MONTHLY:
        return monthlyData;
      case CALENDAR_VIEWS.YEARLY:
        return yearlyData;
      case CALENDAR_VIEWS.DATE_RANGE:
        return dateRangeData;
      default:
        return null;
    }
  };

  const getExportParams = () => {
    switch (viewType) {
      case CALENDAR_VIEWS.MONTHLY:
        return { year, month };
      case CALENDAR_VIEWS.YEARLY:
        return { year };
      case CALENDAR_VIEWS.DATE_RANGE:
        return { startDate, endDate };
      default:
        return {};
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Could show a modal with detailed times
  };

  const handleExport = (format) => {
    console.log(`Exported ${viewType} calendar as ${format}`);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (month === 1) {
        setMonth(12);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else {
      if (month === 12) {
        setMonth(1);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'bn' ? 'ক্যালেন্ডার' : 'Calendar'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'bn' ? 'সালাত ও সাওমের সময় ক্যালেন্ডার দেখুন' : 'View prayer and fasting times calendar'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'bn' ? 'দেখার ধরন' : 'View Type'}
              </label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={CALENDAR_VIEWS.MONTHLY}>
                  {language === 'bn' ? 'মাসিক' : 'Monthly'}
                </option>
                <option value={CALENDAR_VIEWS.YEARLY}>
                  {language === 'bn' ? 'বার্ষিক' : 'Yearly'}
                </option>
                <option value={CALENDAR_VIEWS.DATE_RANGE}>
                  {language === 'bn' ? 'তারিখ পরিসীমা' : 'Date Range'}
                </option>
              </select>
            </div>

            {viewType === CALENDAR_VIEWS.MONTHLY && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bn' ? 'বছর' : 'Year'}
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    min="2020"
                    max="2100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bn' ? 'মাস' : 'Month'}
                  </label>
                  <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    min="1"
                    max="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => {
                      const now = new Date();
                      setYear(now.getFullYear());
                      setMonth(now.getMonth() + 1);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    {language === 'bn' ? 'বর্তমান' : 'Today'}
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    →
                  </button>
                </div>
              </>
            )}

            {viewType === CALENDAR_VIEWS.YEARLY && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'bn' ? 'বছর' : 'Year'}
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  min="2020"
                  max="2100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {viewType === CALENDAR_VIEWS.DATE_RANGE && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bn' ? 'শুরুর তারিখ' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bn' ? 'শেষ তারিখ' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mb-4">
            <CalendarExport
              data={getCurrentData()}
              viewType={viewType}
              params={getExportParams()}
              onExport={handleExport}
            />
          </div>
        </div>

        <div>
          {viewType === CALENDAR_VIEWS.MONTHLY && (
            <MonthlyCalendar year={year} month={month} onDateClick={handleDateClick} />
          )}

          {viewType === CALENDAR_VIEWS.YEARLY && (
            <YearlyCalendar year={year} format="summary" />
          )}

          {viewType === CALENDAR_VIEWS.DATE_RANGE && (
            <DateRangeCalendar
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
