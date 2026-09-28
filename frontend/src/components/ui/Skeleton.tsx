import React from 'react';
import { clsx } from 'clsx';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div
            className={clsx('animate-pulse rounded bg-muted/60 dark:bg-muted/40', className)}
        />
    );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 6 }) => {
    return (
        <div className="w-full space-y-3">
            <div className="flex gap-4 p-3 bg-muted/30 rounded-md">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex gap-4 p-3 border-b border-border/50">
                    {Array.from({ length: columns }).map((_, c) => (
                        <Skeleton key={c} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton: React.FC = () => (
    <div className="p-5 border border-border rounded-lg bg-card space-y-3">
        <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
    </div>
);
