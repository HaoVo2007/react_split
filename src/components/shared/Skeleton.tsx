interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-slate-200 animate-pulse rounded-lg ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
