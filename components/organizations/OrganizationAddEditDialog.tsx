"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuillEditor from "@/components/ui/quillEditor/quillEditor";
import { Save, X, Building2, EyeOff, Eye } from "lucide-react";
import YearDropdown from "./YearDropdown";

interface OrganizationAddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (organization: any) => void;
  loading?: boolean;
  organization?: any | null; // optional for edit mode
}

const OrganizationAddEditDialog: React.FC<OrganizationAddEditDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
  organization,
}) => {
  const { darkMode } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);

  const isEdit = Boolean(organization);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    website: "",
    industry: "",
    founded_year: "",
    description: "",
  });

  // Prefill in edit
  useEffect(() => {
    if (organization) {
      console.log("Organization to edit:", organization);
      setFormData({
        name: organization.orgn_user?.name || "",
        email: "", // no email/password update on edit
        password: "",
        facebook: organization.social_links?.facebook || "",
        twitter: organization.social_links?.twitter || "",
        linkedin: organization.social_links?.linkedin || "",
        instagram: organization.social_links?.instagram || "",
        website: organization.bio?.website || "",
        industry: organization.bio?.industry || "",
        founded_year: organization.bio?.founded_year || "",
        description: organization.bio?.description || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        website: "",
        industry: "",
        founded_year: "",
        description: "",
      });
    }
  }, [organization, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      const reqData = {
        name: formData.name,
        social_links: {
          facebook: formData.facebook,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
        },
        bio: {
          description: formData.description,
          website: formData.website,
          industry: formData.industry,
          founded_year: formData.founded_year,
        },
      };
      console.log("Update Payload:", reqData);
      onSave(reqData);
    } else {
      const reqData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        // role: "company",
        bio: {
          description: formData.description,
          website: formData.website,
          industry: formData.industry,
          founded_year: formData.founded_year,
        },
      };
      console.log("Add Payload:", reqData);
      onSave(reqData);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle>
        <div
          className="flex items-center"
          style={{ color: darkMode ? "#ffffff" : "#000000" }}
        >
          <Building2 className="w-5 h-5 mr-2 text-[#0077ED]" />
          {isEdit ? "Edit Organization" : "Create Organization"}
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
          id="organization-form"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Organization Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter organization name"
              required
            />
          </div>

          {/* Extra fields when adding */}
          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Social Links only in edit */}
          {isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["facebook", "twitter", "linkedin", "instagram"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {field}
                  </label>
                  <Input
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={`https://${field}.com/example`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <Input
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                placeholder="eg. 'Technology'"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Founded Year
              </label>
              <YearDropdown
                value={formData.founded_year}
                onChange={(year) =>
                  setFormData({ ...formData, founded_year: year })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <QuillEditor
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              placeholder="Enter organization description"
              rows={4}
            />
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          form="organization-form"
          type="submit"
          disabled={
            loading ||
            !formData.name ||
            !formData.industry ||
            !formData.founded_year ||
            !formData.description ||
            (!isEdit && (!formData.email || !formData.password))
          }
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
        >
          {loading ? (
            isEdit ? (
              "Updating..."
            ) : (
              "Creating..."
            )
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? "Update Organization" : "Create Organization"}
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrganizationAddEditDialog;
