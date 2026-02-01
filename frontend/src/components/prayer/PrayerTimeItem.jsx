export default function PrayerTimeItem({ label, time, isCurrent = false }) {
  return (
    <div className={`flex justify-between items-center p-3 rounded-md ${
      isCurrent ? 'bg-primary-100 border-2 border-primary-500' : 'bg-gray-50'
    }`}>
      <span className={`font-medium ${isCurrent ? 'text-primary-700' : 'text-gray-700'}`}>
        {label}
      </span>
      <span className={`text-lg font-semibold ${isCurrent ? 'text-primary-700' : 'text-gray-900'}`}>
        {time}
      </span>
    </div>
  );
}
