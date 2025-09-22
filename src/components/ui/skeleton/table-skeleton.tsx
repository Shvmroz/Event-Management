'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showPagination?: boolean;
  showFilters?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 10,
  columns = 6,
  showHeader = true,
  showPagination = true,
  showFilters = true,
}) => {
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

      {/* Filters Skeleton */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      )}

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Table Header */}
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Skeleton className="w-4 h-4" />
                </th>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
                <th className="w-12 px-4 py-3">
                  <Skeleton className="w-4 h-4" />
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-4">
                    <Skeleton className="w-4 h-4" />
                  </td>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-4">
                      {colIndex === 0 ? (
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-10 h-10 rounded-lg" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ) : colIndex === columns - 1 ? (
                        <Skeleton className="h-6 w-16 rounded-full" />
                      ) : (
                        <Skeleton className="h-4 w-20" />
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <Skeleton className="w-8 h-8 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        {showPagination && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSkeleton;