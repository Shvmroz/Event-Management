import React from "react";
import { cn } from "@/lib/utils";

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined" | "text" | "icon"; // 👈 add icon here
  color?: "primary" | "success" | "info" | "warning" | "error" | "default";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
  className?: string;
}

const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<string, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 rounded-md",
  lg: "h-11 px-8 rounded-md",
};

const colorVariants = {
  primary: {
    contained:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700",
    outlined:
      "border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:border-blue-600 dark:text-blue-600 dark:hover:bg-blue-700/40",
    text: "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-blue-600 dark:hover:bg-blue-700/40",
  },
  success: {
    contained:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm dark:bg-green-600 dark:hover:bg-green-700",
    outlined:
      "border border-green-600 bg-transparent text-green-600 hover:bg-green-50 focus:ring-green-500 dark:border-green-600 dark:text-green-600 dark:hover:bg-green-700/40",
    text: "bg-transparent text-green-600 hover:bg-green-50 focus:ring-green-500 dark:text-green-600 dark:hover:bg-green-700/40",
  },
  info: {
    contained:
      "bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-400 shadow-sm dark:bg-sky-500 dark:hover:bg-sky-600",
    outlined:
      "border border-sky-500 bg-transparent text-sky-500 hover:bg-sky-50 focus:ring-sky-400 dark:border-sky-500 dark:text-sky-500 dark:hover:bg-sky-600/40",
    text: "bg-transparent text-sky-500 hover:bg-sky-50 focus:ring-sky-400 dark:text-sky-500 dark:hover:bg-sky-600/40",
  },
  warning: {
    contained:
      "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-sm dark:bg-yellow-600 dark:hover:bg-yellow-700",
    outlined:
      "border border-yellow-600 bg-transparent text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500 dark:border-yellow-600 dark:text-yellow-600 dark:hover:bg-yellow-700/40",
    text: "bg-transparent text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500 dark:text-yellow-600 dark:hover:bg-yellow-700/40",
  },
  error: {
    contained:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm dark:bg-red-600 dark:hover:bg-red-700",
    outlined:
      "border border-red-600 bg-transparent text-red-600 hover:bg-red-50 focus:ring-red-500 dark:border-red-600 dark:text-red-600 dark:hover:bg-red-700/40",
    text: "bg-transparent text-red-600 hover:bg-red-50 focus:ring-red-500 dark:text-red-600 dark:hover:bg-red-700/40",
  },
  default: {
    contained:
      "bg-gray-500 text-white dark:text-gray-800 hover:bg-gray-600 focus:ring-gray-400 shadow-sm dark:bg-gray-400 dark:hover:bg-gray-500",
    outlined:
      "border border-gray-300 bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600/40 dark:bg-gray-800",
    text: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-600/40",
  },
};

// special handling for icon variant
const iconVariant =
  "h-10 w-10 p-0 rounded-full bg-gray-200/50 hover:bg-gray-200 text-gray-500 dark:bg-gray-700/50 dark:hover:bg-gray-700 dark:text-gray-400";

const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant = "contained",
      color = "default",
      size = "default",
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const colorStyles =
      variant === "icon"
        ? iconVariant
        : colorVariants[color]?.[variant] || colorVariants.default.contained;

    const sizeStyles = variant === "icon" ? "" : sizes[size];

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          colorStyles,
          sizeStyles,
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
