import React, { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Calendar, FileText, X, AlertTriangle } from "lucide-react";

interface CsvExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportType: string;
  title: string;
}

const CsvExportDialog: React.FC<CsvExportDialogProps> = ({
  open,
  onOpenChange,
  exportType,
  title,
}) => {
  const { darkMode } = useAppContext();
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });
  const [isExporting, setIsExporting] = useState(false);
  const isDateRangeInvalid =
    new Date(dateRange.end_date) < new Date(dateRange.start_date);
  const handleExport = async () => {
    setIsExporting(true);

    const requestBody = {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      export_type: exportType,
    };

    console.log("Export Request Body:", requestBody);

    try {
      // Simulate API call / replace with actual API
      const response = await fetch(
        `https://api.platform.com/exports/download`, // your API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob(); // get file as blob
      const filename = `export_${dateRange.start_date}_to_${dateRange.end_date}.xlsx`;

      // Create URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      onOpenChange(false);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
    >
      <CustomDialogTitle onClose={() => onOpenChange(false)}>
        <div className="flex items-center">
          <Download className="w-5 h-5 mr-2 text-[#0077ED]" />
          Export {title}
        </div>
      </CustomDialogTitle>

      <CustomDialogContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Export Format: Excel (.xlsx)
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Data will be exported in Excel format with all relevant columns
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={dateRange.start_date}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start_date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={dateRange.end_date}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end_date: e.target.value })
                }
              />

              {isDateRangeInvalid && (
                <div className="flex items-center text-xs text-orange-400 mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1 text-orange-400" />
                  End date cannot be earlier than start date
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> The export will include all{" "}
              {title.toLowerCase()} data within the selected date range. Large
              date ranges may take longer to process.
            </p>
          </div>
        </div>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isExporting}
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
          onClick={handleExport}
          disabled={
            isExporting ||
            !dateRange.start_date ||
            !dateRange.end_date ||
            isDateRangeInvalid
          }
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white dark:text-white"
        >
          {isExporting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              Exporting...
            </div>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </>
          )}
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default CsvExportDialog;
