import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save, X, Shield, ImageIcon, Trash } from "lucide-react";
import StatusSwitch from "@/components/ui/status-switch";
import {
  deleteFileFunction,
  uploadFileFunction,
} from "@/utils/fileUploadRemoveFunctions";
import { s3baseUrl } from "@/config/config";
import { useSnackbar } from "notistack";

interface TeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  access: string[];
  status: boolean;
  created_at: string;
}

interface TeamMemberEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | any;
  onSave: (member: any) => void;
  loading?: boolean;
}

const TeamMemberEditDialog: React.FC<TeamMemberEditDialogProps> = ({
  open,
  onOpenChange,
  member,
  onSave,
  loading = false,
}) => {
  const { darkMode } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    access: [] as string[],
    status: true,
    profile_image: "",
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

  useEffect(() => {
    if (member && open) {
      setFormData({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        access: member.access,
        status: member.status,
        profile_image: member.profile_image || "",
      });
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [member, open]);

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      enqueueSnackbar("Image must be less than or equal to 1MB", {
        variant: "error",
      });
      return;
    }

    setPreviewImage(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, profile_image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit logic with upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    let uploadedImage = formData.profile_image;

    if (previewImage) {
      // delete old if exists
      if (member.profile_image) {
        await deleteFileFunction(member.profile_image);
      }
      uploadedImage = await uploadFileFunction(previewImage);
    }

    const reqData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      access: formData.access,
      status: formData.status,
      profile_image: uploadedImage || "",
    };

    onSave(reqData);
  };

  useEffect(() => {
    if (open) {
      console.log("row Data:", member);
    }
  }, [open]);

  return (
    <CustomDialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
    >
      <CustomDialogTitle
        onClose={() => onOpenChange(false)}
        className="flex items-center justify-between"
      >
        <span style={{ color: darkMode ? "#ffffff" : "#000000" }}>
          Edit Team Member
        </span>
      </CustomDialogTitle>

      <CustomDialogContent sx={{ overflow: "auto" }}>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete="off"
          id="team-member-edit-form"
        >
          {/* Basic Information */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Profile Image */}
            <div className="md:col-span-2 flex flex-col items-center relative">
              <label className="relative w-32 h-32 cursor-pointer">
                <div className="w-full h-full rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img
                      src={URL.createObjectURL(previewImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.profile_image ? (
                    <img
                      src={s3baseUrl + formData.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-1" />
                      <span className="text-xs">Choose Image</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>

              {/* Remove button on top-right corner */}
              {(previewImage || formData.profile_image) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 mt-1 w-7 h-7 bg-white  bg-opacity-70 hover:bg-opacity-100  dark:bg-gray-600 flex items-center justify-center text-red-500 rounded-full shadow-md"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}

              <p className="text-[10px] text-gray-400 text-center mt-0.5">
                Max image Size 1 MB
              </p>
            </div>

            {/* Right: Form Fields */}
            <div className="md:col-span-10 flex flex-col space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {/* Status switch */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <StatusSwitch
                      value={formData.status}
                      onChange={(status) =>
                        setFormData((prev) => ({
                          ...prev,
                          status,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
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
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md h-10"
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
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
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
          form="team-member-edit-form"
          type="submit"
          disabled={loading}
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white dark:text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default TeamMemberEditDialog;
