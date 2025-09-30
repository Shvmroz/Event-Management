import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Info, Code, Calendar, User } from "lucide-react";
import { _email_template_detail_view_api } from "@/DAL/emailTemplatesAPI";
import { useSnackbar } from "notistack";
import Spinner from "@/components/ui/spinner";
import { formatDate } from "@/utils/dateUtils.js";
import Button from "@/components/ui/custom-button";

interface EmailTemplateViewDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string | undefined;
}

const EmailTemplateViewDetailDialog: React.FC<
  EmailTemplateViewDetailDialogProps
> = ({ open, onOpenChange, templateId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { darkMode } = useAppContext();
  const [templateDetail, setTemplateDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getTemplateDetail = async (id: string) => {
    setLoading(true);
    const result = await _email_template_detail_view_api(id);
    if (result?.code === 200) {
      setTemplateDetail(result?.data);
    } else {
      enqueueSnackbar(result?.message || "Failed to fetch template", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && templateId) {
      getTemplateDetail(templateId);
    }
  }, [open, templateId]);

  if (!templateId) return null;

  return (
    <CustomDialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
    >
      {/* --- Title --- */}
      <CustomDialogTitle onClose={() => onOpenChange(false)}>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {templateDetail?.name || "Template Details"}
        </h1>
      </CustomDialogTitle>

      <CustomDialogContent dividers className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Template Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base font-medium">
                  <Info className="w-4 h-4 mr-2 text-[#0077ED]" />
                  Template Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <label className="block font-medium mb-1">Subject</label>
                  <div>{templateDetail?.subject || "-"}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">
                      Template Type
                    </label>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {templateDetail?.template_type?.replace(/_/g, " ") || "-"}
                    </Badge>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Template For
                    </label>
                    <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                      {templateDetail?.template_for || "-"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">
                      Active Status
                    </label>
                    <Badge
                      className={
                        templateDetail?.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }
                    >
                      {templateDetail?.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Status</label>
                    <Badge
                      className={
                        templateDetail?.status
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                      }
                    >
                      {templateDetail?.status ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">Created At</label>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>
                        {templateDetail?.createdAt
                          ? formatDate(templateDetail.createdAt)
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Updated At</label>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span>
                        {templateDetail?.updatedAt
                          ? formatDate(templateDetail.updatedAt)
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Created By</label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="capitalize">
                      {templateDetail?.user_info?.type || "-"}
                    </span>
                    <span className="text-gray-500">
                      ({templateDetail?.user_info?._id || "-"})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base font-medium">
                  <Code className="w-4 h-4 mr-2 text-blue-600" />
                  Variables Used ({templateDetail?.variables?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {templateDetail?.variables?.length > 0 ? (
                    templateDetail.variables.map(
                      (variable: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-md text-sm font-mono"
                        >
                          {variable}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-gray-500">No variables found</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Email Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base font-medium">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  Email Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border rounded-lg p-4 font-mono text-sm ${
                    darkMode
                      ? "border-gray-600 bg-gray-800 text-gray-100"
                      : "border-gray-200 bg-white text-gray-900"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html:
                      templateDetail?.content || "<p>No content available</p>",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </CustomDialogContent>

      <CustomDialogActions>
        <Button variant="outlined" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default EmailTemplateViewDetailDialog;
