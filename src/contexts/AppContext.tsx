import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { _login_api, _logout_api } from "../DAL/authAPI";

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_owner: boolean;
  status: boolean;
  profile_image: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  read: boolean;
  created_at: string;
}

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => Promise<{ success: boolean }>;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to EventManager",
      message:
        "Your account has been successfully created. Start by creating your first event!",
      notification_type: "success",
      read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "New Event Registration",
      message:
        'Shamroz Khan has registered for your "Tech Conference 2024" event.',
      notification_type: "event",
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      title: "Payment Received",
      message: "Payment of $299 received for event registration.",
      notification_type: "payment",
      read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  // Initialize authentication state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        console.log(
          "User data loaded from localStorage:",
          JSON.parse(userData)
        );
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Initialize dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // =========================== Login

  const login = async (email: string, password: string) => {
    setLoading(true);
  
    try {
      const req_data = { email, password };
      const result = await _login_api(req_data);
  
      if (result?.code === 200) {
        localStorage.setItem("authToken", result?.token);
        localStorage.setItem("userData", JSON.stringify(result?.admin));
        setUser(result.admin);
        setIsAuthenticated(true);
  
        enqueueSnackbar("Login successful", { variant: "success" });
        return { success: true };
      } else {
        enqueueSnackbar(result?.message, { variant: "error" });
        return { success: false };
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong. Please try again.", {
        variant: "error",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  
  // ======================= Logout
  const logout = async () => {
    const result = await _logout_api();
    if (result?.code === 200) {
      navigate("/login");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setUser(null);
      enqueueSnackbar("Logged out successfully", { variant: "success" });
      return { success: true };
    } else {
      enqueueSnackbar(result?.message || "Logout failed", { variant: "error" });
      navigate("/login");
      return { success: false };
    }
  };
  // ======================= Toggle Dark Mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };
  // =====================================================

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  // =====================================================

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };
  // =====================================================

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  ////////////////////////////////////////////////////////////////////////////
  /////////////////////// PASS CONTEXT VALUE TO CHILDREN /////////////////////
  ////////////////////////////////////////////////////////////////////////////

  const value: AppContextType = {
    isAuthenticated,
    user,
    setUser,
    loading,
    login,
    logout,
    darkMode,
    toggleDarkMode,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
