import React from 'react';
import { SnackbarProvider, SnackbarProviderProps, useSnackbar } from 'notistack';
import { X } from 'lucide-react';

// Custom snackbar content component
const CustomSnackbarContent = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { id, message, variant } = props;
  const { closeSnackbar } = useSnackbar();

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div
      ref={ref}
      className={`
        flex items-center justify-between px-4 py-3 rounded-md shadow-lg
        min-w-[300px] max-w-[400px] ${getVariantStyles()}
      `}
    >
      <div className="flex-1 pr-3">
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={() => {
          closeSnackbar(id);
        }}
        className="text-white hover:bg-white/20 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

CustomSnackbarContent.displayName = 'CustomSnackbarContent';

// Custom snackbar provider
export const CustomSnackbarProvider: React.FC<SnackbarProviderProps> = ({ children, ...props }) => {
  return (
    <SnackbarProvider
      Components={{
        default: CustomSnackbarContent,
        success: CustomSnackbarContent,
        error: CustomSnackbarContent,
        warning: CustomSnackbarContent,
        info: CustomSnackbarContent,
      }}
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      preventDuplicate={true}
      dense={false}
      {...props}
    >
      {children}
    </SnackbarProvider>
  );
};

export default CustomSnackbarProvider;
