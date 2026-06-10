export function LoadingGroups() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 animate-pulse"
        >
          <div className="flex items-start gap-4">
            {/* Image Skeleton */}
            <div className="w-16 h-16 rounded-2xl bg-slate-200 flex-shrink-0" />

            {/* Content Skeleton */}
            <div className="flex-1 space-y-3 w-full">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
