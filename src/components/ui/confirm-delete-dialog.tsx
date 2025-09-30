import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import Button from "./custom-button";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  content?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  loading?: boolean;
  success?: boolean;
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
  success = false,
}) => {
  const handleClose = () => {
    if (!loading) onOpenChange(false);
  };

  return (
    <CustomDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <CustomDialogTitle onClose={handleClose}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-500/20 rounded-full">
            {success ? (
              <AlertTriangle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </CustomDialogTitle>

      <CustomDialogContent>
        <p className="text-gray-600 dark:text-gray-400">{content}</p>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          className={
            success
              ? "bg-green-600 hover:bg-green-700 text-white"
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
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default ConfirmDeleteDialog;
