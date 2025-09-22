"use client";

import React from "react";
import { Dialog } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  content?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  loading?: boolean;
  confirmButtonClass?: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  content = "This action cannot be undone. This will permanently delete the item.",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  onConfirm,
  loading = false,
  confirmButtonClass,
}) => {
  const handleClose = () => {
    if (!loading) onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className:
          "p-6 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xl",
      }}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-gray-100 dark:bg-red-600/20 rounded-full">
          {confirmButtonClass ? (
            <AlertTriangle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          )}
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Content */}
      <p className="text-gray-600 dark:text-gray-400">{content}</p>

      {/* Footer */}
      <div className="flex justify-end space-x-2 mt-6">
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outline"
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          className={
            confirmButtonClass
              ? confirmButtonClass
              : "bg-red-600 hover:bg-red-700 text-white"
          }
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              {confirmButtonText}...
            </div>
          ) : (
            confirmButtonText
          )}
        </Button>
      </div>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
