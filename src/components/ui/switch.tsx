import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        ref={ref}
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <div
        className={cn(
          "h-6 w-11 rounded-full transition-colors relative",
          "bg-gray-300 dark:bg-gray-600 peer-checked:bg-[#0077ED]",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
          "after:h-5 after:w-5 after:rounded-full after:bg-white dark:after:bg-gray-200",
          "after:transition-transform after:shadow-lg",
          "peer-checked:after:translate-x-5",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    </label>
  )
);

Switch.displayName = "Switch";

export { Switch };
