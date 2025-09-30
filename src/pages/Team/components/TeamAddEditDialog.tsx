import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  X,
  Shield,
  ImageIcon,
  Trash,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import StatusSwitch from "@/components/ui/status-switch";
import {
  deleteFileFunction,
  uploadFileFunction,
} from "@/utils/fileUploadRemoveFunctions";
import { s3baseUrl } from "@/config/config";
import { useSnackbar } from "notistack";
import Spinner from "../../../components/ui/spinner";
import Button from "@/components/ui/custom-button";

interface TeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  access: string[];
  status: boolean;
  createdAt: string;
  profile_image?: string;
}

interface TeamAddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember | null; // null for add mode, TeamMember for edit mode
  onSave: (member: any) => void;
  loading?: boolean;
}

const TeamAddEditDialog: React.FC<TeamAddEditDialogProps> = ({
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
  const [showPassword, setShowPassword] = useState(false);

  // Determine if this is add mode (no member) or edit mode (has member)
  const isAddMode = !member;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
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

  // Initialize form data based on mode
  useEffect(() => {
    if (isAddMode) {
      // Add mode - reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        access: [],
        status: true,
        profile_image: "",
      });
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (member && open) {
      // Edit mode - populate with member data
      setFormData({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        password: "", // Don't populate password in edit mode
        access: member.access,
        status: member.status,
        profile_image: member.profile_image || "",
      });
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [member, open, isAddMode]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedImage = formData.profile_image;

    // Handle image upload for edit mode
    if (!isAddMode && previewImage) {
      // delete old if exists
      if (member?.profile_image) {
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
      ...(isAddMode && { password: formData.password }), // Only include password for add mode
      ...(!isAddMode && { profile_image: uploadedImage || "" }), // Only include profile_image for edit mode
    };

    onSave(reqData);
  };

  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      access: [],
      status: true,
      profile_image: "",
    });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const isFormValid = () => {
    const basicFieldsValid =
      formData.first_name && formData.last_name && formData.email;

    if (isAddMode) {
      return basicFieldsValid && formData.password;
    }

    return basicFieldsValid;
  };

  return (
    <CustomDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <CustomDialogTitle onClose={handleClose}>
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-[#0077ED]" />
          {isAddMode ? "Add Team Member" : "Edit Team Member"}
        </div>
      </CustomDialogTitle>

      <CustomDialogContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          id={isAddMode ? "team-member-create-form" : "team-member-edit-form"}
          autoComplete="off"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h3>

            {/* Profile Image - Only for Edit Mode */}
            {!isAddMode && (
              <div className="flex justify-center mb-4">
                {/* reduced mb */}
                <div className="relative">
                  <label className="relative block w-28 h-28 cursor-pointer">
                    {/* slightly smaller */}
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
                        <div className="flex flex-col items-center justify-center text-gray-400">
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

                  {/* Remove button */}
                  {(previewImage || formData.profile_image) && (
                    <span
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-600 
                     flex items-center justify-center text-red-500 rounded-full 
                     shadow-md hover:scale-105 transition cursor-pointer"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </span>
                  )}

                  <p className="text-[11px] text-gray-400 text-center mt-1">
                    Max image size 1 MB
                  </p>
                </div>
              </div>
            )}

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
                  required
                  autoComplete="off"
                />
              </div>

              {/* Password field - Only for Add Mode */}
              {isAddMode && (
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
                      className="pr-12"
                      required
                      autoComplete="off"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Status field - Only for Edit Mode */}
              {!isAddMode && (
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
              )}
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
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          form={isAddMode ? "team-member-create-form" : "team-member-edit-form"}
          type="submit"
          disabled={loading || !isFormValid()}
          variant="contained"
          color="primary"
        >
          <span className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {loading && <Spinner size="sm" className="text-white mr-2" />}
            {loading
              ? isAddMode
                ? "Creating..."
                : "Saving..."
              : isAddMode
              ? "Create Member"
              : "Save Changes"}
          </span>
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default TeamAddEditDialog;
