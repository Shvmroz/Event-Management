"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProvider } from "@/contexts/AppContext";
import { SnackbarProvider } from "notistack";

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

export default function App({ children }: { children: React.ReactNode }) {
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
        <AppProvider>{children}</AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
