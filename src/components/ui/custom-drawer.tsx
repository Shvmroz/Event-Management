import React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
  onFilter?: () => void;
  clearButtonText?: string;
  filterButtonText?: string;
  clearButtonIcon?: React.ReactNode;
  filterButtonIcon?: React.ReactNode;
  showClearButton?: boolean;
  showFilterButton?: boolean;
  loading?: boolean;
  applyButtonDisabled?: boolean;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onOpenChange,
  title,
  children,
  onClear,
  onFilter,
  clearButtonText = "Clear",
  filterButtonText = "Apply Filters",
  clearButtonIcon = <RotateCcw className="w-4 h-4" />,
  filterButtonIcon = <Filter className="w-4 h-4" />,
  showClearButton = true,
  showFilterButton = true,
  loading = false,
  applyButtonDisabled = false,
}) => {
  return (
    <SheetPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <SheetPrimitive.Description className="sr-only">
        This drawer contains filter options for the list.
      </SheetPrimitive.Description>
      
      <SheetPrimitive.Portal>
        {/* Overlay */}
        <SheetPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/80",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />

        {/* Drawer Content */}
        <SheetPrimitive.Content
          className={cn(
            "fixed right-0 top-0 z-50 h-full w-full sm:max-w-md bg-white dark:bg-gray-900 shadow-lg flex flex-col",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-500",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-300"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <SheetPrimitive.Title className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Filter className="w-5 h-5 mr-2 text-blue-500" />
              {title || "Filters"}
            </SheetPrimitive.Title>

            <SheetPrimitive.Close className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none ">
              <X className="h-5 w-5 text-gray-900 dark:text-gray-100" />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {children}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {showClearButton && onClear && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClear}
                  disabled={loading}
                  className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {clearButtonIcon && (
                    <span className="mr-2">{clearButtonIcon}</span>
                  )}
                  {clearButtonText}
                </Button>
              )}

              {showFilterButton && onFilter && (
                <Button
                  type="button"
                  onClick={onFilter}
                  disabled={applyButtonDisabled}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
                      Applying...
                    </div>
                  ) : (
                    <>
                      {filterButtonIcon && (
                        <span className="mr-2">{filterButtonIcon}</span>
                      )}
                      {filterButtonText}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};

export default CustomDrawer;
