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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/organizations" element={<OrganizationsPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/email-templates" element={<EmailTemplatesPage />} />
      <Route path="/payment-plans" element={<PaymentPlansPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/configuration" element={<ConfigurationPage />} />
      <Route path="/configuration/email" element={<EmailConfigurationPage />} />
      <Route path="/configuration/stripe" element={<StripeConfigurationPage />} />

      {/* Redirect root → dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
