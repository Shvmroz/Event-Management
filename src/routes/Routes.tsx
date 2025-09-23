import { Routes, Route, Navigate } from "react-router-dom";

// Import page components

import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "@/pages/Login/LoginPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import AnalyticsPage from "@/pages/Analytics/AnalyticsPage";
import CompaniesPage from "@/pages/Companies/CompaniesPage";
import OrganizationsPage from "@/pages/Organizations/OrganizationsPage";
import EventsPage from "@/pages/Events/EventsPage";
import EmailTemplatesPage from "@/pages/EmailTemplates/EmailTemplatesPage";
import PaymentPlansPage from "@/pages/PaymentPlans/PaymentPlansPage";
import TeamPage from "@/pages/Team/TeamPage";
import ProfilePage from "@/pages/Profile/ProfilePage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import ChangePasswordPage from "@/pages/ChangePassword/ChangePasswordPage";
import ConfigurationPage from "@/pages/Configuration/ConfigurationPage";
import EmailConfigurationPage from "@/pages/Configuration/EmailConfigurationPage";
import StripeConfigurationPage from "@/pages/Configuration/StripeConfigurationPage";

// Route configuration
export const routeConfig = [
  // Public Routes
  {
    path: "/login",
    element: <LoginPage />,
    isPublic: true,
  },
  
  // Protected Routes
  {
    path: "/dashboard",
    element: <DashboardPage />,
    isPublic: false,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
    isPublic: false,
  },
  {
    path: "/companies",
    element: <CompaniesPage />,
    isPublic: false,
  },
  {
    path: "/organizations",
    element: <OrganizationsPage />,
    isPublic: false,
  },
  {
    path: "/events",
    element: <EventsPage />,
    isPublic: false,
  },
  {
    path: "/email-templates",
    element: <EmailTemplatesPage />,
    isPublic: false,
  },
  {
    path: "/payment-plans",
    element: <PaymentPlansPage />,
    isPublic: false,
  },
  {
    path: "/team",
    element: <TeamPage />,
    isPublic: false,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    isPublic: false,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    isPublic: false,
  },
  {
    path: "/change-password",
    element: <ChangePasswordPage />,
    isPublic: false,
  },
  {
    path: "/configuration",
    element: <ConfigurationPage />,
    isPublic: false,
  },
  {
    path: "/configuration/email",
    element: <EmailConfigurationPage />,
    isPublic: false,
  },
    {
      path: "/configuration/stripe",
      element: <StripeConfigurationPage />,
      isPublic: false,
    },
    {
      path: "*", // Catch-all route for 404
      element: <NotFoundPage />,
      isPublic: true,
    },
  ];

// Main App Routes Component
export default function AppRoutes() {
  return (
    <Routes>
      {routeConfig.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      <Route 
        path="/" 
        element={<Navigate to="/dashboard" replace />} 
      />
      
      {/* Catch all route - 404 Page */}
      <Route 
        path="*" 
        element={<NotFoundPage />} 
      />
    </Routes>
  );
}
