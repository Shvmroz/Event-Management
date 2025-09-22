"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
  Tag,
} from "lucide-react";
import CustomTable, {
  TableHeader,
  MenuOption,
} from "@/components/ui/custom-table";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import EmailTemplateEditDialog from "@/components/email-templates/EmailTemplateEditDialog";
import EmailTemplateCreateDialog from "@/components/email-templates/EmailTemplateCreateDialog";
import EmailTemplatePreviewDialog from "@/components/email-templates/EmailTemplatePreviewDialog";
import CustomDrawer from "@/components/ui/custom-drawer";
import EmailTemplateFilters from "@/components/email-templates/EmailTemplateFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CsvExportDialog from "@/components/ui/csv-export-dialog";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { useSnackbar } from "notistack";

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  template_type: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  deleted_at?: string;
  is_deleted?: boolean;
}

const EmailTemplatesPageClient: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [rowData, setRowData] = useState<EmailTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    template: EmailTemplate | null;
  }>({ open: false, template: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    template: EmailTemplate | null;
  }>({ open: false, template: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    template: EmailTemplate | null;
  }>({ open: false, template: null });

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Local pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersApplied, setFiltersApplied] = useState({
    search: "",
    sort_by: "created_at",
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

  // Load email templates
  const getListEmailTemplates = async (searchQuery = "", filters = {}) => {
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const result = await _email_templates_list_api(currentPage, rowsPerPage, searchQuery, filters);
      
      // Simulate API response structure
      const result = {
        code: 200,
        data: {
          email_templates: [],
          total_count: 0,
          total_pages: 1,
          filters_applied: filters,
        }
      };

      if (result?.code === 200) {
        setEmailTemplates(result.data.email_templates || []);
        setTotalCount(result.data.total_count || 0);
        setTotalPages(result.data.total_pages || 1);
        // setFiltersApplied(result.data.filters_applied || {});
      } else {
        // enqueueSnackbar(result?.message || "Failed to load email templates", {
        //   variant: "error",
        // });
        setEmailTemplates([]);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Something went wrong", { variant: "error" });
      setEmailTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListEmailTemplates();
  }, [currentPage, rowsPerPage]);

  if (loading && emailTemplates.length === 0) {
    return <TableSkeleton rows={8} columns={6} showFilters={true} />;
  }

  const handlePreview = (template: EmailTemplate) => {
    setPreviewDialog({ open: true, template });
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditDialog({ open: true, template });
    setRowData(template);
  };

  const handleDelete = (template: EmailTemplate) => {
    setDeleteDialog({ open: true, template });
    setRowData(template);
  };

  const handleConfirmDelete = async () => {
    if (!rowData?._id) return;

    setDeleteLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _delete_email_template_api(rowData._id);
      
      // Simulate API response
      const result = { code: 200, message: 'Email template deleted successfully' };

      if (result?.code === 200) {
        setEmailTemplates(prev =>
          prev.filter(template => template._id !== rowData._id)
        );
        setDeleteDialog({ open: false, template: null });
        setRowData(null);
        enqueueSnackbar("Email template deleted successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to delete email template", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting email template:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setDeleteLoading(false);
    }
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
        message: 'Email template updated successfully',
        data: { ...rowData, ...data }
      };

      if (result?.code === 200) {
        setEditDialog({ open: false, template: null });
        setRowData(null);
        setEmailTemplates(prev =>
          prev.map(template => template._id === rowData._id ? { ...template, ...data } : template)
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

  const handleAddNewTemplate = async (data: Partial<EmailTemplate>) => {
    setAddLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _add_email_template_api(data);
      
      // Simulate API response
      const result = {
        code: 200,
        message: 'Email template created successfully',
        data: { _id: `template_${Date.now()}`, ...data }
      };

      if (result?.code === 200) {
        // setEmailTemplates(prev => [result.data, ...prev]);
        setCreateDialog(false);
        enqueueSnackbar("Email template created successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to create email template", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error creating email template:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setAddLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getListEmailTemplates(searchQuery);
  };

  // Filter functions
  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (typeFilter !== "all") count++;
    if (activeOnly) count++;
    if (createdFrom || createdTo) count += 1;

    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setActiveOnly(false);
    setCreatedFrom("");
    setCreatedTo("");
    setFilterDrawerOpen(false);
    getListEmailTemplates();
  };

  const handleApplyFilters = () => {
    const filters: { [key: string]: string } = {};

    if (statusFilter === "active") filters.status = "true";
    else if (statusFilter === "inactive") filters.status = "false";

    if (typeFilter !== "all") filters.template_type = typeFilter;
    if (activeOnly) filters.active_only = "true";
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

  const MENU_OPTIONS: MenuOption[] = [
    {
      label: "Edit",
      action: handleEdit,
      icon: <Edit className="w-4 h-4" />,
    },
    {
      label: "Delete",
      action: handleDelete,
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
    },
  ];

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        Inactive
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      key: "template",
      label: "Template",
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
              {template.variables.length} variables
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
      key: "template_type",
      label: "Type",
      renderData: (template) => (
        <Badge className={template.template_type}>
          {template.template_type
            .replace("_", " ")
            .replace(/\b\w/g, (x: string) => x.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderData: (template) => getStatusBadge(template.is_active),
    },
    {
      key: "created_at",
      label: "Created",
      renderData: (template) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(template.created_at)}
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
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setExportDialog(true)}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
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
              {filtersApplied?.search && filtersApplied.search !== "" ? (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    getListEmailTemplates("");
                  }}
                  variant="outline"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Clear
                </Button>
              ) : (
                <Button
                  onClick={handleSearch}
                  disabled={searchQuery === ""}
                  variant="outline"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Search
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setFilterDrawerOpen(true)}
              variant="outline"
              className="relative border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        onRowClick={(template) =>
          setPreviewDialog({ open: true, template })
        }
        loading={loading}
        emptyMessage="No email templates found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, template: null })}
        title="Delete Email Template"
        content={`Are you sure you want to delete "${deleteDialog.template?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Email Template Dialog */}
      <EmailTemplateEditDialog
        open={editDialog.open}
        onOpenChange={(open) => {
          setEditDialog({ open, template: null });
          if (!open) setRowData(null);
        }}
        template={rowData}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Email Template Dialog */}
      <EmailTemplateCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleAddNewTemplate}
        loading={addLoading}
      />

      {/* Preview Email Template Dialog */}
      <EmailTemplatePreviewDialog
        open={previewDialog.open}
        onOpenChange={(open) => setPreviewDialog({ open, template: null })}
        template={previewDialog.template}
      />

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="email_templates"
        title="Email Templates"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Email Templates"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
        applyButtonDisabled={isDateRangeInvalid}
      >
        <EmailTemplateFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          activeOnly={activeOnly}
          setActiveOnly={setActiveOnly}
        />
      </CustomDrawer>
    </div>
  );
};

export default EmailTemplatesPageClient;