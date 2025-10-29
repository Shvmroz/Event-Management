import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/ui/searchable-select";
import StatusSwitch from "@/components/ui/status-switch";
import { Save, X } from "lucide-react";
import QuillEditor from "@/components/ui/quillEditor/quillEditor";
import Button from "@/components/ui/custom-button";

const templateTypes = [
  "welcome",
  "password_reset",
  "email_verification",
  "event_reminder",
  "payment_confirmation",
  "subscription_expired",
  "newsletter",
  "custom",
];

const templateTypeOptions = templateTypes.map((type) => ({
  value: type,
  label: type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  template_type: string;
  content: string;
  variables: string[];
  is_active: boolean;
  createdAt: string;
}

interface EmailTemplateEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
  onSave: (template: any) => void;
  loading?: boolean;
}

const EmailTemplateEditDialog: React.FC<EmailTemplateEditDialogProps> = ({
  open,
  onOpenChange,
  template,
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

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        template_type: template.template_type,
        content: template.content,
        variables: template.variables,
        is_active: template.is_active,
      });
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (template) {
      const updatedTemplate: EmailTemplate = {
        ...template,
        ...formData,
      };
      onSave(updatedTemplate);
    }
  };

  const extractVariables = (content: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches: RegExpMatchArray | null = content.match(regex);

    if (matches) {
      const cleaned = matches.map((match: string) =>
        match.replace(/[{}]/g, "")
      );
      return Array.from(new Set(cleaned));
    }

    return [];
  };

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content,
      variables: extractVariables(content),
    });
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
    >
      <CustomDialogTitle onClose={() => onOpenChange(false)}>
        Edit Email Template
      </CustomDialogTitle>

      <CustomDialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            id="template-edit-form"
          >
            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Template Name
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

            {/* Template Type */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Template Type
              </label>
              <SearchableSelect
                options={templateTypeOptions}
                value={formData.template_type}
                onChange={(value) =>
                  setFormData({ ...formData, template_type: value })
                }
                placeholder="Select template type"
                search={true}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Subject Line
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

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Email Content (HTML)
              </label>
              <QuillEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Enter email content..."
                rows={8}
              />
            </div>

            {/* Variables */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Variables ({formData.variables.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.variables.map((variable, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded text-sm font-mono"
                  >
                    {`${variable}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Template Status
              </label>
              <StatusSwitch
                value={formData.is_active}
                onChange={(value) =>
                  setFormData({ ...formData, is_active: value })
                }
                activeLabel="Active"
                inactiveLabel="Inactive"
              />
            </div>
          </form>
        </div>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          variant="outlined"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          form="template-edit-form"
          type="submit"
          disabled={loading}
          variant="contained"
          color="primary"
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

export default EmailTemplateEditDialog;
