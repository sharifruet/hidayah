/**
 * Shimmer skeleton for the QuranReader ayah list.
 * Shows 5 placeholder ayah cards that match the real card layout.
 */
export default function QuranSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mx-4 mb-4 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <AyahSkeleton key={i} last={i === 4} wide={i % 2 === 0} />
      ))}
    </div>
  );
}

function AyahSkeleton({ last, wide }) {
  return (
    <div className={`px-4 py-5 ${last ? '' : 'border-b border-gray-100'}`}>
      {/* Number + actions row */}
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="w-8 h-8 rounded-full" />
        <div className="flex gap-2">
          <Shimmer className="w-7 h-7 rounded-full" />
          <Shimmer className="w-7 h-7 rounded-full" />
          <Shimmer className="w-7 h-7 rounded-full" />
          <Shimmer className="w-7 h-7 rounded-full" />
        </div>
      </div>

      {/* Arabic text placeholder — right-aligned lines of varying width */}
      <div className="flex flex-col items-end gap-2 mb-4">
        <Shimmer className={`h-8 rounded-lg ${wide ? 'w-4/5' : 'w-3/5'}`} />
        <Shimmer className="h-8 rounded-lg w-2/5" />
      </div>

      {/* Translation placeholder */}
      <div className="flex flex-col gap-1.5 mt-3">
        <Shimmer className="h-4 rounded w-full" />
        <Shimmer className="h-4 rounded w-5/6" />
        <Shimmer className={`h-4 rounded ${wide ? 'w-3/4' : 'w-1/2'}`} />
      </div>
    </div>
  );
}

function Shimmer({ className }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{ animationDuration: '1.4s' }}
    />
  );
}
