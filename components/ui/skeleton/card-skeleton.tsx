'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface CardSkeletonProps {
  cards?: number;
  showHeader?: boolean;
  showStats?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  cards = 4,
  showHeader = true,
  showStats = true,
  columns = 2,
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      )}

      {/* Cards Grid Skeleton */}
      <div className={`grid ${getGridCols()} gap-6`}>
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
            
            {showStats && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-18" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSkeleton;