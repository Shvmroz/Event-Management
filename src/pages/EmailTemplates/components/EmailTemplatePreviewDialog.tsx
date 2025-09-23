"use client";

import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { Button } from "@/components/ui/button";
import { X, Mail, Eye } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  template_type: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
}

interface EmailTemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
}

const EmailTemplatePreviewDialog: React.FC<EmailTemplatePreviewDialogProps> = ({
  open,
  onOpenChange,
  template,
}) => {
  const { darkMode } = useAppContext();

  if (!template) return null;

  const getSampleValue = (variable: string) => {
    const sampleValues: { [key: string]: string } = {
      platform_name: "ExiBy Platform",
      user_name: "Shamroz Khan",
      event_name: "Tech Conference 2024",
      event_date: "March 15, 2024",
      event_time: "10:00 AM",
      event_location: "Convention Center",
      event_details:
        "A comprehensive tech conference featuring industry leaders and networking opportunities",
      login_url: "https://platform.com/login",
      reset_url: "https://platform.com/reset-password",
      payment_amount: "$299.00",
      transaction_id: "TXN123456789",
      payment_date: "January 20, 2024",
    };
    return sampleValues[variable] || `[${variable}]`;
  };

  const renderPreview = () => {
    let previewContent = template.content;
    template.variables.forEach((variable) => {
      const sampleValue = getSampleValue(variable);
      previewContent = previewContent.replace(
        new RegExp(`{{${variable}}}`, "g"),
        sampleValue
      );
    });
    return previewContent;
  };

  const renderSubjectPreview = () => {
    let previewSubject = template.subject;
    template.variables.forEach((variable) => {
      const sampleValue = getSampleValue(variable);
      previewSubject = previewSubject.replace(
        new RegExp(`{{${variable}}}`, "g"),
        sampleValue
      );
    });
    return previewSubject;
  };

  const getTypeColor = (type: string) => {
    const typeColors = {
      user_registration:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      event_registration:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      password_reset:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      event_reminder:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      payment_confirmation:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    };
    return (
      typeColors[type as keyof typeof typeColors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    );
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
          className="flex items-center justify-between"
          style={{ color: darkMode ? "#ffffff" : "#000000" }}
        >
          <div className="flex items-center">
            <Eye className="w-5 h-5 mr-2 text-[#0077ED]" />
            {template.name}
          </div>
          <IconButton onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5 text-foreground" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 4 }}
        dividers
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <div className="space-y-6">
          {/* Subject Preview */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Subject :{" "}
              <span className="text-sm text-black-900 font-normal dark:text-white">
                {renderSubjectPreview()}
              </span>
            </h3>
          </div>

          {/* Email Content Preview */}
          <div
            className={`border rounded-lg p-4 ${
              darkMode
                ? "border-gray-600 bg-gray-800 text-gray-100"
                : "border-gray-200 bg-white text-gray-900"
            }`}
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
          />

          {/* Variables Used */}
          <div className="space-y-4">
            {/* Type Chip */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Type
              </h3>
              <Badge className={getTypeColor(template.template_type)}>
                {template.template_type
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            </div>

            {/* Variables Used */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Variables Used ({template.variables.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm font-mono"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => onOpenChange(false)}
          style={{
            backgroundColor: darkMode ? "#374151" : "#f9fafb",
            color: darkMode ? "#f3f4f6" : "#374151",
            borderColor: darkMode ? "#4b5563" : "#d1d5db",
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailTemplatePreviewDialog;