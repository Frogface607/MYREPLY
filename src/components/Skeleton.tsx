'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`shimmer rounded-lg bg-muted-light ${className}`}
      aria-hidden="true"
    />
  );
}

export function ResponseSkeleton() {
  return (
    <div className="response-card animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
    </div>
  );
}

export function ResponseSkeletonGroup() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-40 h-5" />
      </div>
      <div className="grid gap-4">
        <ResponseSkeleton />
        <ResponseSkeleton />
        <ResponseSkeleton />
      </div>
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4">
          <div className="flex justify-between items-start mb-3">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="space-y-2 mb-3">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-2/3 h-3" />
          </div>
          <div className="pt-3 border-t border-border">
            <div className="space-y-2">
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

