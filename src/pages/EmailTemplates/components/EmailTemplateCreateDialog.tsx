"use client";

import React, { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, Mail, Eye } from "lucide-react";

interface EmailTemplateCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: any) => void;
  loading?: boolean;
}

const EmailTemplateCreateDialog: React.FC<EmailTemplateCreateDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
}) => {
  const { darkMode } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    template_type: "user_registration",
    content: "",
    variables: [] as string[],
    is_active: true,
  });
 

  const templateTypes = [
    "user_registration",
    "event_registration",
    "password_reset",
    "event_reminder",
    "payment_confirmation",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTemplate = {
      _id: `template_${Date.now()}`,
      ...formData,
      created_at: new Date().toISOString(),
    };

    onSave(newTemplate);

    // Reset form
    setFormData({
      name: "",
      subject: "",
      template_type: "user_registration",
      content: "",
      variables: [],
      is_active: true,
    });
   
  };

  const extractVariables = (content: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = content.match(regex);

    if (!matches) return [];

    // Remove curly braces and return unique variables
    const variables = matches.map((match) => match.replace(/{{|}}/g, ""));
    return Array.from(new Set(variables));
  };

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content,
      variables: extractVariables(content),
    });
  };

  const renderPreview = () => {
    let previewContent = formData.content;
    formData.variables.forEach((variable) => {
      const sampleValue = getSampleValue(variable);
      previewContent = previewContent.replace(
        new RegExp(`${variable}`, "g"),
        sampleValue
      );
    });
    return previewContent;
  };

  const getSampleValue = (variable: string) => {
    const sampleValues: { [key: string]: string } = {
      platform_name: "ExiBy Platform",
      user_name: "Shamroz khan",
      event_name: "Tech Conference 2024",
      event_date: "March 15, 2024",
      event_time: "10:00 AM",
      event_location: "Convention Center",
      event_details:
        "A comprehensive tech conference featuring industry leaders",
      login_url: "https://platform.com/login",
      reset_url: "https://platform.com/reset-password",
      payment_amount: "$299.00",
      transaction_id: "TXN123456789",
      payment_date: "January 20, 2024",
    };
    return sampleValues[variable] || `[${variable}]`;
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
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        <div
          className="flex items-center"
          style={{ color: darkMode ? "#ffffff" : "#000000" }}
        >
          <Mail className="w-5 h-5 mr-2 text-[#0077ED]" />
          Create Email Template
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 2, overflow: "visible" }}
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              id="template-create-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Template Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter template name"
                    style={{
                      backgroundColor: darkMode ? "#374151" : "#ffffff",
                      color: darkMode ? "#ffffff" : "#000000",
                      borderColor: darkMode ? "#4b5563" : "#d1d5db",
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Template Type *
                  </label>
                  <Select
                    value={formData.template_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, template_type: value })
                    }
                    required
                  >
                    <SelectTrigger
                      style={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#ffffff" : "#000000",
                        borderColor: darkMode ? "#4b5563" : "#d1d5db",
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#ffffff" : "#000000",
                        borderColor: darkMode ? "#4b5563" : "#d1d5db",
                      }}
                    >
                      {templateTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Subject *
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Enter email subject"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Email Content (HTML) *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Enter HTML content "
                  rows={12}
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                  className="font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Variables ({formData.variables.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded text-sm font-mono"
                    >
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Active Template
                </label>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Live Preview
            </h3>
            <div
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: renderPreview() }}
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions
        sx={{
          
          borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
        }}
      >
     
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
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
          form="template-create-form"
          type="submit"
          disabled={
            loading || !formData.name || !formData.subject || !formData.content
          }
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white dark:text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              Creating...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Template
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailTemplateCreateDialog;