"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ---------------- Table Primitives ----------------
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// ---------------- CustomTable Props ----------------// ---------------- CustomTable Props ----------------
export interface TableHeader {
  key: string;
  label: string;
  width?: string;
  type?: "text" | "action";
  renderData?: (row: any, rowIndex?: number) => React.ReactNode;
}

export interface MenuOption {
  label: string;
  action: (item: any) => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
}

export interface PaginationConfig {
  total_count: number;
  rows_per_page: number;
  page: number;
  handleChangePage: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

interface CustomTableProps {
  data: any[];
  TABLE_HEAD: TableHeader[];
  MENU_OPTIONS: MenuOption[];
  custom_pagination: PaginationConfig;
  totalPages: number;
  onRowClick?: (item: any) => void;
  renderCell?: (
    item: any,
    header: TableHeader,
    index?: number
  ) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

// ---------------- CustomTable Component ----------------
const CustomTable: React.FC<CustomTableProps> = ({
  data,
  TABLE_HEAD,
  MENU_OPTIONS,
  custom_pagination,
  totalPages,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
}) => {
  const {
    total_count,
    rows_per_page,
    page,
    handleChangePage,
    onRowsPerPageChange,
  } = custom_pagination;

  const startItem = (page - 1) * rows_per_page + 1;
  const endItem = Math.min(page * rows_per_page, total_count);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-8 text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-gray-700 border-t-2 border-t-[#0077ED]"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full overflow-hidden">
      <div className="overflow-x-auto table-scroll">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700/50">
              {TABLE_HEAD.map((header) => (
                <TableHead
                  key={header.key}
                  className={`text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap ${
                    header.width || ""
                  }`}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={TABLE_HEAD.length}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    {emptyMessage}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow
                  key={item._id}
                  className={cn(
                    "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {TABLE_HEAD.map((header) => (
                    <TableCell
                      key={header.key}
                      className="py-4 whitespace-nowrap"
                    >
                      {header.type === "action" ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {MENU_OPTIONS.map((option, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={() => option.action(item)}
                                  className={
                                    option.variant === "destructive"
                                      ? "text-red-600"
                                      : ""
                                  }
                                >
                                  {option.icon && (
                                    <span className="mr-2">{option.icon}</span>
                                  )}
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : header.renderData ? (
                        header.renderData(item, rowIndex)
                      ) : (
                        <span className="text-gray-900 dark:text-white">
                          {item[header.key]}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startItem} to {endItem} of {total_count} results
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Rows per page:
              </span>
              <Select
                value={rows_per_page.toString()}
                onValueChange={(value) => onRowsPerPageChange(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChangePage(page - 1)}
                disabled={page <= 1}
                className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages}
                className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
