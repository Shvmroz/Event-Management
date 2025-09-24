"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuillEditor from "@/components/ui/quillEditor/quillEditor";
import { Save, X, Building2, Eye, EyeOff } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import YearDropdown from "../../Organizations/components/YearDropdown";

interface CompanyAddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (company: any) => void;
  loading?: boolean;
  company?: any | null; // optional for edit mode
}

const CompanyAddEditDialog: React.FC<CompanyAddEditDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
  company,
}) => {
  const { darkMode } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);

  const isEdit = Boolean(company);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    industry: "",
    company_size: "",
    founded_year: "",
    location: "",
    services: [] as string[],
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    phone: "",
    address: "",
    // website: "",
    contactEmail: "",
  });

  // Prefill in edit mode
  useEffect(() => {
    if (company) {
      console.log("Company to edit:", company);
      setFormData({
        name: company.orgn_user?.name || "",
        email: "", // login email not editable
        password: "",
        description: company.bio?.description || "",
        industry: company.bio?.industry || "",
        company_size: company.bio?.company_size || "",
        founded_year: company.bio?.founded_year?.toString() || "",
        location: company.bio?.location || "",
        services: company.bio?.services || [],
        linkedin: company.social_links?.linkedin || "",
        twitter: company.social_links?.twitter || "",
        facebook: company.social_links?.facebook || "",
        instagram: company.social_links?.instagram || "",
        // website: company.bio?.website || "",
        phone: company.contact?.phone || "",
        address: company.contact?.address || "",
        contactEmail: company.contact?.email || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        description: "",
        industry: "",
        company_size: "",
        founded_year: "",
        location: "",
        services: [],
        linkedin: "",
        twitter: "",
        facebook: "",
        instagram: "",
        // website: "",
        phone: "",
        address: "",
        contactEmail: "",
      });
    }
  }, [company, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      const reqData = {
        bio: {
          description: formData.description,
          industry: formData.industry,
          company_size: formData.company_size,
          founded_year: formData.founded_year,
          location: formData.location,
          services: formData.services,
          // website: formData.website,
        },
        social_links: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          facebook: formData.facebook,
          instagram: formData.instagram,
        },
        contact: {
          email: formData.contactEmail,
          phone: formData.phone,
          address: formData.address,
        },
      };
      console.log("Update Payload:", reqData);
      onSave(reqData);
    } else {
      const reqData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        bio: {
          description: formData.description,
          industry: formData.industry,
          company_size: formData.company_size,
          founded_year: formData.founded_year,
          location: formData.location,
          services: formData.services,
        },
        social_links: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          facebook: formData.facebook,
          instagram: formData.instagram,
        },
        contact: {
          email: formData.contactEmail,
          phone: formData.phone,
          address: formData.address,
        },
      };
      console.log("Add Payload:", reqData);
      onSave(reqData);
    }
  };

  const handleServiceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault();
      const newService = e.currentTarget.value.trim();
      if (!formData.services.includes(newService)) {
        setFormData({
          ...formData,
          services: [...formData.services, newService],
        });
      }
      e.currentTarget.value = "";
    }
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    });
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
          {isEdit ? "Edit Company" : "Create Company"}
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6" id="company-form">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter company name"
              required
            />
          </div>

          {/* Email + Password (only in add) */}
          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Login Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter login email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
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

          {/* Website */}
          {/* {isEdit && (
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
          )} */}

          {/* Industry / Size / Year / Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <Input
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                placeholder="e.g. Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Size
              </label>
              <Input
                value={formData.company_size}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9-]/g, ""); // allow only digits and dash
                  setFormData({ ...formData, company_size: value });
                }}
                placeholder="e.g. 11-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g. New York, NY, USA"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium mb-2">Services</label>
            <Input
              placeholder="Type a service and press Enter"
              onKeyDown={handleServiceKeyDown}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.services.map((service, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {service}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeService(service)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Social Links */}
          {["linkedin", "twitter", "facebook", "instagram"].map((field) => (
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

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Email
              </label>
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1-555-0123"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="123 Tech Street"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Suspense fallback={<div>Loading editor...</div>}>
              <QuillEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Enter company description"
                rows={4}
              />
            </Suspense>
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
          form="company-form"
          type="submit"
          disabled={
            loading ||
            !formData.name ||
            !formData.industry ||
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
              {isEdit ? "Update Company" : "Create Company"}
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyAddEditDialog;
