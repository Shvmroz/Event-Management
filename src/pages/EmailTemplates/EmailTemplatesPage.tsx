import React, { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Filter,
  Edit,
  EyeIcon,
} from "lucide-react";
import CustomTable, {
  TableHeader,
  MenuOption,
} from "@/components/ui/custom-table";
import CustomDrawer from "@/components/ui/custom-drawer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { useSnackbar } from "notistack";
import EmailTemplateEditDialog from "./components/EmailTemplateEditDialog";
import EmailTemplateViewDetailDialog from "./components/EmailTemplateViewDetailDialog";
import EmailTemplateFilters from "./components/EmailTemplateFilters";
import { _email_templates_list_api } from "@/DAL/emailTemplatesAPI";
import { formatDateTime } from "@/utils/dateUtils.js";
import Button from "@/components/ui/custom-button";

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  template_type: string;
  content: string;
  variables: string[];
  is_active: boolean;
  template_for: string;
  status: boolean;
  user_info: {
    type: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

const EmailTemplatesPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<EmailTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [editDialog, setEditDialog] = useState(false);
  const [viewDetailDialog, setViewDetailDialog] = useState(false);
  const [preViewDialog, setPreViewDialog] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  // Local pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersApplied, setFiltersApplied] = useState({
    search: "",
    sort_by: "createdAt",
    sort_order: "desc",
    page: 1,
    limit: 50,
  });

  // Table helpers
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  };

  const TABLE_HEAD: TableHeader[] = [
    {
      key: "index",
      label: "#",
      renderData: (row, rowIndex) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {rowIndex !== undefined ? rowIndex + 1 : "-"}.
        </span>
      ),
    },
    {
      key: "name",
      label: "Template Name",
      renderData: (template) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {template.name}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {template.variables.length || "No"} variables
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "subject",
      label: "Subject",
      renderData: (template) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 dark:text-white truncate">
            {template.subject}
          </div>
        </div>
      ),
    },
  
    {
      key: "template_for",
      label: "Template For",
      renderData: (template) => (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 capitalize">
          {template.template_for || "N/A"}
        </Badge>
      ),
    },
    {
      key: "template_type",
      label: "Type",
      renderData: (template) => (
        <Badge className="capitalize">{template.template_type} </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderData: (template) => getStatusBadge(template.is_active),
    },
    {
      key: "createdAt",
      label: "Created",
      renderData: (template) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDateTime(template.createdAt)}
        </span>
      ),
    },
    {
      key: "action",
      label: "",
      type: "action",
      width: "w-12",
    },
  ];

  const handleEdit = (template: EmailTemplate) => {
    setEditDialog(true);
    setRowData(template);
  };

  const handlePreview = (template: EmailTemplate) => {
    setPreViewDialog(true);
    setRowData(template);
    console.log("Preview Template" , preViewDialog, template);
  };

  const handleSaveEdit = async (data: Partial<EmailTemplate>) => {
    if (!rowData?._id) return;
    setEditLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _edit_email_template_api(rowData._id, data);

      // Simulate API response
      const result = {
        code: 200,
        message: "Email template updated successfully",
        data: { ...rowData, ...data },
      };

      if (result?.code === 200) {
        setEditDialog(false);
        setRowData(null);
        setEmailTemplates((prev) =>
          prev.map((template) =>
            template._id === rowData._id ? { ...template, ...data } : template
          )
        );
        enqueueSnackbar("Email template updated successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to update email template", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error updating email template:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setEditLoading(false);
    }
  };

  const getListEmailTemplates = async (
    searchQuery?: string,
    filters?: { [key: string]: string }
  ) => {
    setLoading(true);
    const result = await _email_templates_list_api(
      currentPage,
      rowsPerPage,
      searchQuery || "",
      filters || {}
    );

    if (result?.code === 200) {
      setEmailTemplates(result.data.email_templates || []);
      setTotalCount(result.data.total_count);
      setTotalPages(result.data.total_pages);
      setFiltersApplied(result.data.filters_applied || filtersApplied);
    } else {
      enqueueSnackbar(result?.message || "Failed to load email templates", {
        variant: "error",
      });
      setEmailTemplates([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getListEmailTemplates(searchQuery);
  };

  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (createdFrom || createdTo) count++;
    return count;
  };

  const handleApplyFilters = () => {
    const filters: { [key: string]: string } = {};

    if (statusFilter === "active") filters.status = "true";
    else if (statusFilter === "inactive") filters.status = "false";

    if (createdFrom) filters.created_from = createdFrom;
    if (createdTo) filters.created_to = createdTo;

    //  Check if there are any applied filters
    const hasFilters =
      Object.keys(filters).length > 0 &&
      Object.values(filters).some((val) => val && val !== "");

    if (!hasFilters) {
      enqueueSnackbar("Please select at least one filter", {
        variant: "warning",
      });
      return;
    }

    getListEmailTemplates(searchQuery, filters);
    setFilterDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setCreatedFrom("");
    setCreatedTo("");
    getListEmailTemplates();
    setFilterDrawerOpen(false);
  };

  const MENU_OPTIONS: MenuOption[] = [
    {
      label: "Edit",
      action: handleEdit,
      icon: <Edit className="w-4 h-4" />,
    },
    {
      label: "View Template",
      action: handlePreview,
      icon: <EyeIcon className="w-4 h-4" />,
    },
  ];


  const getStatusBadge = (isActive: boolean) =>
    isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        Inactive
      </Badge>
    );

  useEffect(() => {
    getListEmailTemplates();
  }, [currentPage, rowsPerPage]);

  if (loading && emailTemplates.length === 0) {
    return <TableSkeleton rows={8} columns={6} showFilters={true} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and customize email templates for your platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative w-full flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search email templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-24"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={searchQuery === ""}
                variant="outlined"
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setFilterDrawerOpen(true)}
               variant="outlined"
              className="relative"
              >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {getAppliedFiltersCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs px-2">
                  {getAppliedFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Email Templates Table */}
      <CustomTable
        data={emailTemplates}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={MENU_OPTIONS}
        custom_pagination={{
          total_count: totalCount,
          rows_per_page: rowsPerPage,
          page: currentPage,
          handleChangePage,
          onRowsPerPageChange,
        }}
        totalPages={totalPages}
        onRowClick={(template) => {
          setViewDetailDialog(true);
          setRowData(template);
        }}
        loading={loading}
        emptyMessage="No email templates found"
      />

      {/* Edit Email Template Dialog */}
      <EmailTemplateEditDialog
        open={editDialog}
        onOpenChange={(open) => {
          setEditDialog(open);
          if (!open) setRowData(null);
        }}
        template={rowData}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* View Detail Email Template Dialog */}
      <EmailTemplateViewDetailDialog
        open={viewDetailDialog}
        onOpenChange={(open) => {
          setViewDetailDialog(open);
          if (!open) setRowData(null);
        }}
        templateId={rowData?._id}
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Email Templates"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
        applyButtonDisabled={false}
      >
        <EmailTemplateFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          createdFrom={createdFrom}
          setCreatedFrom={setCreatedFrom}
          createdTo={createdTo}
          setCreatedTo={setCreatedTo}
          isDateRangeInvalid={isDateRangeInvalid}
        />
      </CustomDrawer>
    </div>
  );
};

export default EmailTemplatesPage;
