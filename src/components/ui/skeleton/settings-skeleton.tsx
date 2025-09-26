import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Legal Documents Editor Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="w-5 h-5 mr-2" />
            <Skeleton className="h-6 w-40" />
          </div>
          
          <div className="space-y-6">
            {/* Tabs Skeleton */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <Skeleton className="h-8 w-32 rounded-sm" />
              <Skeleton className="h-8 w-36 rounded-sm" />
            </div>

            {/* Content Editor Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-48" />
              
              {/* Quill Editor Skeleton */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
                {/* Toolbar */}
                <div className="border-b border-gray-200 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="w-8 h-8 rounded" />
                    ))}
                  </div>
                </div>
                
                {/* Editor Content */}
                <div className="p-4 space-y-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-5/6' : 'w-4/5'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Last Updated Info */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSkeleton;