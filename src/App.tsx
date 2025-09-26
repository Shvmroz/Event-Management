import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import { SnackbarProvider } from "notistack";
import AppRoutes from "./routes/Routes";
import MainLayout from "./layout/MainLayout";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./components/ui/spinner";

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
});

// 🔑 Put the logic inline here
const AppInner: React.FC = () => {
  const { isAuthenticated, loading } = useAppContext();
  const location = useLocation();

  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  //  If authenticated and tries to go to /login → redirect
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/dashboard" replace />;
  }

  //  Public route
  if (isPublicRoute) {
    return <AppRoutes />;
  }

  //  Protected routes (with layout)
  if (isAuthenticated) {
    return (
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    );
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
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
          <AppInner />
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
