import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === 'number' && ['e', 'E'].includes(e.key)) {
        e.preventDefault();
      }
      onKeyDown?.(e); // keep user-defined handler working
    };

    return (
      <input
        type={type}
        ref={ref}
        onKeyDown={handleKeyDown}
        className={cn(
          // base styles
          'w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-orange-200 dark:focus:ring-sky-800',
          // light mode
          'bg-white text-black placeholder-gray-400 border-gray-300',
          // dark mode
          'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600',
          // calendar icon fix
          '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
          '[&::-webkit-calendar-picker-indicator]:invert-0',
          'dark:[&::-webkit-calendar-picker-indicator]:invert',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
