import React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  SxProps,
  Theme,
} from "@mui/material";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

interface CustomDialogTitleProps {
  children: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  showCloseButton?: boolean;
  onClose?: () => void;
}

interface CustomDialogContentProps {
  children: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  dividers?: boolean;
}

interface CustomDialogActionsProps {
  children: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onClose,
  maxWidth = "md",
  fullWidth = true,
  className,
  sx,
  children,
}) => {
  const { darkMode } = useAppContext();

  const defaultSx: SxProps<Theme> = {
    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
    color: darkMode ? "#ffffff" : "#000000",
    borderRadius: "12px",
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const mergedSx = sx ? { ...defaultSx, ...sx } : defaultSx;

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: mergedSx,
        className: cn("shadow-xl", className),
      }}
    >
      {children}
    </MuiDialog>
  );
};

const CustomDialogTitle: React.FC<CustomDialogTitleProps> = ({
  children,
  className,
  sx,
  showCloseButton = true,
  onClose,
}) => {
  const { darkMode } = useAppContext();

  const defaultSx: SxProps<Theme> = {
    padding: "16px 24px",
    borderBottom: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
    flexShrink: 0,
  };

  const mergedSx = sx ? { ...defaultSx, ...sx } : defaultSx;

  return (
    <MuiDialogTitle
      sx={mergedSx}
      className={cn("flex items-center justify-between", className)}
    >
      <div className="flex-1">{children}</div>
      {showCloseButton && onClose && (
      <button
      onClick={onClose}
      className={`
        p-1 rounded-full transition-colors
        ${darkMode ? "text-gray-400 hover:bg-white/10 hover:text-white" : "text-gray-500 hover:bg-black/5 hover:text-gray-900"}
      `}
    >
      <X className="w-6 h-6" />
    </button>
    
      )}
    </MuiDialogTitle>
  );
};

const CustomDialogContent: React.FC<CustomDialogContentProps> = ({
  children,
  className,
  sx,
  dividers = false,
}) => {
  const { darkMode } = useAppContext();

  const defaultSx: SxProps<Theme> = {
    padding: "24px",
    color: darkMode ? "#ffffff" : "#000000",
    flex: 1,
    overflow: "auto",
    "&.MuiDialogContent-root": {
      paddingTop: "16px !important",
    },
  };

  const mergedSx = sx ? { ...defaultSx, ...sx } : defaultSx;

  return (
    <MuiDialogContent
      dividers={dividers}
      sx={mergedSx}
      className={cn("overflow-y-auto", className)}
    >
      {children}
    </MuiDialogContent>
  );
};

const CustomDialogActions: React.FC<CustomDialogActionsProps> = ({
  children,
  className,
  sx,
}) => {
  const { darkMode } = useAppContext();

  const defaultSx: SxProps<Theme> = {
    padding: "16px 24px",
    borderTop: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
    gap: "8px",
    flexShrink: 0,
  };

  const mergedSx = sx ? { ...defaultSx, ...sx } : defaultSx;

  return (
    <MuiDialogActions
      sx={mergedSx}
      className={cn("flex justify-end", className)}
    >
      {children}
    </MuiDialogActions>
  );
};

export {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
};
