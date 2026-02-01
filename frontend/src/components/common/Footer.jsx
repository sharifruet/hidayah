export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Salat & Saom Timing API</p>
          <p className="mt-2">Coordinate-based prayer and fasting times for Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
