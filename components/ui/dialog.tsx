"use client";

import * as React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  useTheme,
} from "@mui/material";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = MuiDialog;

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("cursor-pointer", className)} {...props} />
));
DialogTrigger.displayName = "DialogTrigger";

const DialogPortal = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  }
>(
  (
    { className, children, open, onOpenChange, maxWidth = "md", ...props },
    ref
  ) => {
    const theme = useTheme();

    return (
      <MuiDialog
        open={open || false}
        onClose={() => onOpenChange?.(false)}
        maxWidth={maxWidth}
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor:
              theme.palette.mode === "dark" ? "#1f2937" : "#ffffff",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            borderRadius: "12px",
          },
        }}
      >
        <div
          ref={ref}
          className={cn("relative bg-background text-foreground", className)}
          {...props}
        >
          {children}
          <IconButton
            onClick={() => onOpenChange?.(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.mode === "dark" ? "#9ca3af" : "#6b7280",
              "&:hover": {
                backgroundColor: theme.palette.action.hover, // auto adapts to dark/light
                color: theme.palette.mode === "dark" ? "#ffffff" : "#111827", // hover text color
              },
            }}
          >
            <X className="h-4 w-4 text-foreground" />
          </IconButton>
        </div>
      </MuiDialog>
    );
  }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("cursor-pointer", className)} {...props} />
));
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
