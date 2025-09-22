"use client";

import React, { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { _add_admin_team_api } from "@/DAL/adminTeamAPI";

import { Switch } from "@/components/ui/switch";
import {
  Save,
  X,
  Users,
  Eye,
  EyeOff,
  Shield,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useSnackbar } from "notistack";
import Spinner from "../ui/spinner";

interface TeamMemberCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (member: any) => void;
  loading?: boolean;
}

const TeamMemberCreateDialog: React.FC<TeamMemberCreateDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
}) => {

  const { darkMode } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    access: [] as string[],
    status: true,
  });

  const availableModules = [
    "dashboard",
    "organizations",
    "companies",
    "events",
    "payment_plans",
    "email_templates",
    "analytics",
    "team",
    "configuration",
    "settings",
  ];

  const moduleLabels = {
    dashboard: "Dashboard",
    organizations: "Organizations",
    companies: "Companies",
    events: "Events",
    payment_plans: "Payment Plans",
    email_templates: "Email Templates",
    analytics: "Analytics",
    team: "Team Management",
    configuration: "Configuration",
    settings: "Settings",
  };

  const handleAccessChange = (module: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        access: [...prev.access, module],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        access: prev.access.filter((m) => m !== module),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reqData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      access: formData.access,
      status: formData.status,
    };
    
    onSave(reqData);

  };

  const handleClose = () => {
    setFormData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      access: [],
      status: true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>
        <div
          className="flex items-center"
          style={{ color: darkMode ? "#ffffff" : "#000000" }}
        >
          <Users className="w-5 h-5 mr-2 text-[#0077ED]" />
          Add Team Member
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          id="team-member-create-form"
          autoComplete="off"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <Input
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder="Enter first name"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <Input
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  placeholder="Enter last name"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="user@exiby.com"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#ffffff",
                  color: darkMode ? "#ffffff" : "#000000",
                  borderColor: darkMode ? "#4b5563" : "#d1d5db",
                }}
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                  className="pr-12"
                  required
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="status"
                checked={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked })
                }
                className="w-4 h-4 rounded border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {formData.status ? "Active User" : "Inactive User"}
              </label>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Module Access Permissions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableModules.map((module) => (
                <div
                  key={module}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {moduleLabels[module as keyof typeof moduleLabels]}
                    </span>
                  </div>
                  <Switch
                    checked={formData.access.includes(module)}
                    onCheckedChange={(checked) =>
                      handleAccessChange(module, checked)
                    }
                    className="data-[state=checked]:bg-[#0077ED]"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions
        sx={{ borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}` }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          style={{
            backgroundColor: darkMode ? "#374151" : "#f9fafb",
            color: darkMode ? "#f3f4f6" : "#374151",
            borderColor: darkMode ? "#4b5563" : "#d1d5db",
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          form="team-member-create-form"
          type="submit"
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          disabled={
            loading ||
            !formData.first_name ||
            !formData.last_name ||
            !formData.email ||
            !formData.password
          }
        >
          {loading && <Spinner size="sm" className="text-white" />}
          <span>{loading ? "Creating..." : "Create Member"}</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMemberCreateDialog;
