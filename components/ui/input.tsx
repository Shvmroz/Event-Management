'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 ' +
            'bg-white text-gray-900 placeholder-gray-400 border-gray-300 ' + // light mode
            'dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 ' + // dark mode
            // Calendar icon styles
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer ' + // pointer cursor
            '[&::-webkit-calendar-picker-indicator]:invert-0 ' + // light mode normal
            'dark:[&::-webkit-calendar-picker-indicator]:invert ' + // dark mode inverted
            className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
