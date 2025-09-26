import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
  disabled?: boolean;
}

const StatusSwitch: React.FC<StatusSwitchProps> = ({
  value,
  onChange,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  className,
  disabled = false,
}) => {
  return (
    <div className={cn('flex bg-gray-50 dark:bg-gray-700 rounded-md p-1 h-10 border border-gray-300 dark:border-gray-600', className)}>
      <button
        type="button"
        onClick={() => !disabled && onChange(true)}
        disabled={disabled}
        className={cn(
          'flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 h-full',
          value
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {activeLabel}
      </button>
      <button
        type="button"
        onClick={() => !disabled && onChange(false)}
        disabled={disabled}
        className={cn(
          'flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 h-full',
          !value
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <XCircle className="w-4 h-4 mr-2" />
        {inactiveLabel}
      </button>
    </div>
  );
};

export default StatusSwitch;
