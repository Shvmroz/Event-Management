import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchableSelect from "@/components/ui/searchable-select";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2, Clock, AlertTriangle } from "lucide-react";
import { formatDate } from "@/utils/dateUtils.js";
import Button from "./custom-button";

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
  const [restoreDialog, setRestoreDialog] = React.useState(false);
  const [permanentDeleteDialog, setPermanentDeleteDialog] =
    React.useState(false);
  const [rowData, setRowData] = React.useState<T | null>(null);

  const handleRestore = (item: T) => {
    setRestoreDialog(true);
    setRowData(item);
  };
  const handlePermanentDelete = (item: T) => {
    setPermanentDeleteDialog(true);
    setRowData(item);
  };

  const confirmRestore = () => {
    if (rowData) {
      onRestore(rowData);
      setRestoreDialog(false);
      setRowData(null);
    }
  };

  const confirmPermanentDelete = () => {
    if (rowData) {
      onPermanentDelete(rowData);
      setPermanentDeleteDialog(false);
      setRowData(null);
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

  const totalPages = Math.ceil(
    pagination.total_count / pagination.rows_per_page
  );
  const startItem = (pagination.page - 1) * pagination.rows_per_page + 1;
  const endItem = Math.min(
    pagination.page * pagination.rows_per_page,
    pagination.total_count
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-gray-700 border-t-2 border-t-orange-500"></div>
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
                        <p className="text-gray-500 dark:text-gray-400">
                          {emptyMessage}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
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
                    Showing {startItem} to {endItem} of {pagination.total_count}{" "}
                    results
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Rows per page:
                    </span>
                    <SearchableSelect
                      options={[
                        { value: "5", label: "5" },
                        { value: "10", label: "10" },
                        { value: "20", label: "20" },
                        { value: "50", label: "50" },
                        { value: "100", label: "100" },
                      ]}
                      value={pagination.rows_per_page.toString()}
                      onChange={(value) =>
                        pagination.onRowsPerPageChange(parseInt(value))
                      }
                      className="w-20"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={() =>
                        pagination.handleChangePage(pagination.page - 1)
                      }
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                      Page {pagination.page} of {totalPages}
                    </span>

                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={() =>
                        pagination.handleChangePage(pagination.page + 1)
                      }
                      disabled={pagination.page >= totalPages}
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
        open={restoreDialog}
        onOpenChange={(open) => {
          setRestoreDialog(open);
          if (!open) setRowData(null);
        }}
        title="Restore Item"
        content={`Are you sure you want to restore "${
          rowData ? getItemName(rowData) : ""
        }"? This will move the item back to the active list.`}
        success={true}
        confirmButtonText="Restore"
        cancelButtonText="Cancel"
        onConfirm={confirmRestore}
        loading={restoreLoading}
      />

      {/* Permanent Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={permanentDeleteDialog}
        onOpenChange={(open) => {
          setPermanentDeleteDialog(open);
          if (!open) setRowData(null);
        }}
        title="Permanent Delete"
        content={`Are you sure you want to permanently delete "${
          rowData ? getItemName(rowData) : ""
        }"? This action cannot be undone and will completely remove all data.`}
        confirmButtonText="Permanently Delete"
        cancelButtonText="Cancel"
        onConfirm={confirmPermanentDelete}
        loading={deleteLoading}
      />
    </>
  );
}

export default SoftDeleteTable;
