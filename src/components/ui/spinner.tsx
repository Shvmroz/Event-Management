import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string; // Tailwind color for the arc
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'lg',
  className,
  color = 'border-blue-500',
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-4',
    lg: 'w-8 h-8 border-4',
    xl: 'w-12 h-12 border-8',
  };

  return (
    <div
      className={cn(
        'rounded-full border-4 border-blue-500 border-t-gray-200 animate-spin',
        sizeClasses[size],
        className
      )}
      style={{
        borderTopColor: color, 
      }}
    />
  );
};

export default Spinner;
