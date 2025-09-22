'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PageSkeletonProps {
  type?: 'dashboard' | 'table' | 'form' | 'analytics' | 'profile' | 'settings';
  showHeader?: boolean;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
  type = 'table',
  showHeader = true,
}) => {
  const renderContent = () => {
    switch (type) {
      case 'dashboard':
        return (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <Skeleton className="w-5 h-5" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border h-[360px]">
                  <div className="p-6 border-b">
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-8 h-8 rounded" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'form':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ))}
            </div>
          </>
        );

      case 'profile':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 flex flex-col items-center">
                <Skeleton className="w-full aspect-square rounded-lg" />
                <Skeleton className="h-3 w-32 mt-2" />
              </div>
              <div className="md:col-span-7 space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <Skeleton className="w-5 h-5 mr-2" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="space-y-6">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-36" />
              </div>
              <div>
                <Skeleton className="h-4 w-48 mb-3" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        );

      default: // table
        return (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            
            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
              <div className="p-4">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 mb-4 pb-3 border-b">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-20" />
                  ))}
                </div>
                
                {/* Table Rows */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-6 gap-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-16" />
                    ))}
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-20" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
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

      {renderContent()}
    </div>
  );
};

export default PageSkeleton;