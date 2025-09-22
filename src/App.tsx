import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProvider } from "./contexts/AppContext";
import { SnackbarProvider } from "notistack";
import AppRoutes from "./routes/Routes";
import MainLayout from "./layout/MainLayout";
import { useAppContext } from "./contexts/AppContext";
import { useLocation } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0077ED",
      dark: "#0066CC",
      light: "#4A9AFF",
    },
    secondary: {
      main: "#6B7280",
      dark: "#374151",
      light: "#9CA3AF",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        },
      },
    },
  },
});


// Component to handle layout logic
const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAppContext();
  const location = useLocation();
  
  // Define which routes need authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // Define skeleton types for different routes
  const getSkeletonType = (pathname: string) => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.includes('/analytics')) return 'analytics';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/profile')) return 'profile';
    return 'table';
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // For public routes, render without layout
  if (isPublicRoute) {
    return <AppRoutes />;
  }

  // For authenticated routes, wrap with MainLayout
  if (isAuthenticated) {
    return (
      <MainLayout requireAuth={true} skeletonType={getSkeletonType(location.pathname)}>
        <AppRoutes />
      </MainLayout>
    );
  }

  // If not authenticated and not on public route, redirect to login
  return <AppRoutes />;
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        autoHideDuration={3000}
      >
        <CssBaseline />
        <AppProvider>
          <AppContent />
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
