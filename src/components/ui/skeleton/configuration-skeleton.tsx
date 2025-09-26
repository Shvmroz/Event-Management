import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ConfigurationSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Configuration Form Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="w-5 h-5 mr-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <div className="relative">
                    <Skeleton className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>

            {/* Logo Section */}
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="relative">
                <Skeleton className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="mt-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
              </div>
            </div>

            {/* Last Updated */}
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <div className="relative">
                <Skeleton className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSkeleton;