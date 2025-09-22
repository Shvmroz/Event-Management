"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2, Clock, AlertTriangle } from "lucide-react";

interface SoftDeleteTableProps<T> {
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRestore: (item: T) => void;
  onPermanentDelete: (item: T) => void;
  getItemName: (item: T) => string;
  getDeletedAt: (item: T) => string;
  getDaysUntilPermanentDelete: (item: T) => number;
  restoreLoading?: boolean;
  deleteLoading?: boolean;
  pagination: {
    total_count: number;
    rows_per_page: number;
    page: number;
    handleChangePage: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
  };
}

function SoftDeleteTable<T extends { _id: string }>({
  data,
  loading = false,
  emptyMessage = "No deleted items found",
  onRestore,
  onPermanentDelete,
  getItemName,
  getDeletedAt,
  getDaysUntilPermanentDelete,
  restoreLoading = false,
  deleteLoading = false,
  pagination,
}: SoftDeleteTableProps<T>) {
  const [restoreDialog, setRestoreDialog] = React.useState<{ open: boolean; item: T | null }>({ open: false, item: null });
  const [permanentDeleteDialog, setPermanentDeleteDialog] = React.useState<{ open: boolean; item: T | null }>({ open: false, item: null });

  const handleRestore = (item: T) => setRestoreDialog({ open: true, item });
  const handlePermanentDelete = (item: T) => setPermanentDeleteDialog({ open: true, item });

  const confirmRestore = () => {
    if (restoreDialog.item) {
      onRestore(restoreDialog.item);
      setRestoreDialog({ open: false, item: null });
    }
  };

  const confirmPermanentDelete = () => {
    if (permanentDeleteDialog.item) {
      onPermanentDelete(permanentDeleteDialog.item);
      setPermanentDeleteDialog({ open: false, item: null });
    }
  };

  const getDaysLeftBadge = (daysLeft: number) => {
    if (daysLeft <= 3) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {daysLeft} days left
        </Badge>
      );
    } else if (daysLeft <= 7) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          {daysLeft} days left
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          {daysLeft} days left
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(pagination.total_count / pagination.rows_per_page);
  const startItem = (pagination.page - 1) * pagination.rows_per_page + 1;
  const endItem = Math.min(pagination.page * pagination.rows_per_page, pagination.total_count);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-gray-700 border-t-2 border-t-[#0077ED]"></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Deleted At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Days Until Permanent Delete
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {getItemName(item)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            {formatDate(getDeletedAt(item))}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {getDaysLeftBadge(getDaysUntilPermanentDelete(item))}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Badge
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestore(item);
                              }}
                              className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Restore
                            </Badge>
                            <Badge
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePermanentDelete(item);
                              }}
                              className="cursor-pointer bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {startItem} to {endItem} of {pagination.total_count} results
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Rows per page:
                    </span>
                    <Select
                      value={pagination.rows_per_page.toString()}
                      onValueChange={(value) => pagination.onRowsPerPageChange(parseInt(value))}
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
                      onClick={() => pagination.handleChangePage(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                      Page {pagination.page} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pagination.handleChangePage(pagination.page + 1)}
                      disabled={pagination.page >= totalPages}
                      className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Restore Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={restoreDialog.open}
        onOpenChange={(open) => setRestoreDialog({ open, item: null })}
        title="Restore Item"
        content={`Are you sure you want to restore "${restoreDialog.item ? getItemName(restoreDialog.item) : ""}"? This will move the item back to the active list.`}
        confirmButtonClass="bg-green-600 hover:bg-green-700 text-white"
        confirmButtonText="Restore"
        cancelButtonText="Cancel"
        onConfirm={confirmRestore}
        loading={restoreLoading}
      />

      {/* Permanent Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={permanentDeleteDialog.open}
        onOpenChange={(open) => setPermanentDeleteDialog({ open, item: null })}
        title="Permanent Delete"
        content={`Are you sure you want to permanently delete "${permanentDeleteDialog.item ? getItemName(permanentDeleteDialog.item) : ""}"? This action cannot be undone and will completely remove all data.`}
        confirmButtonText="Permanently Delete"
        cancelButtonText="Cancel"
        onConfirm={confirmPermanentDelete}
        loading={deleteLoading}
      />
    </>
  );
}

export default SoftDeleteTable;