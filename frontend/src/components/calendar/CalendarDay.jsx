import { format } from 'date-fns';

export default function CalendarDay({ day, dayData, isToday = false, onClick = null, labels = {} }) {
  const dayNumber = format(day, 'd');

  return (
    <div
      onClick={onClick}
      className={`
        aspect-square border rounded-lg p-2 cursor-pointer transition-all
        ${isToday ? 'bg-primary-100 border-primary-500 border-2' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
        ${onClick ? 'hover:shadow-md' : ''}
      `}
    >
      <div className="flex flex-col h-full">
        <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
          {dayNumber}
        </div>

        {dayData?.prayer_times && (
          <div className="flex-1 text-xs space-y-0.5">
            <div className="text-gray-600">
              <span className="font-medium">{labels.fajr || 'Fajr'}:</span> {dayData.prayer_times.fajr}
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{labels.maghrib || 'Maghrib'}:</span> {dayData.prayer_times.maghrib}
            </div>
            {dayData.fasting && (
              <div className="text-orange-600 font-medium mt-1">
                {dayData.fasting.iftar}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
