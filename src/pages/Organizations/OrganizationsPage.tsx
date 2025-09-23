"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Users,
  DollarSign,
  Building,
} from "lucide-react";
import CustomTable, {
  TableHeader,
  MenuOption,
} from "@/components/ui/custom-table";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import CustomDrawer from "@/components/ui/custom-drawer";
import SoftDeleteTable from "@/components/ui/soft-delete-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CsvExportDialog from "@/components/ui/csv-export-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { useSnackbar } from "notistack";
import {
  _add_organization_api,
  _edit_organizations_api,
  _organizations_list_api,
} from "@/DAL/organizationAPI";
import OrganizationAddEditDialog from "./components/OrganizationAddEditDialog";
import OrganizationDetailView from "./components/OrganizationDetailView";
import OrganizationFilters from "./components/OrganizationFilters";

interface Organization {
  _id: string;
  orgn_user: {
    _id: string;
    name: string;
  };
  bio: {
    description: string;
    website: string;
  };
  category: string;
  subscription_status: string;
  subscription_start: string;
  subscription_end: string;
  status: boolean;
  total_events: number;
  total_companies: number;
  total_revenue: number;
  total_attendees: number;
  createdAt: string;
  deleted_at?: string;
  is_deleted?: boolean;
}

const OrganizationsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [deletedOrganizations, setDeletedOrganizations] = useState<
    Organization[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [rowData, setRowData] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    organization: Organization | null;
  }>({ open: false, organization: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    organization: Organization | null;
  }>({ open: false, organization: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [detailView, setDetailView] = useState<{
    open: boolean;
    organization: Organization | null;
  }>({ open: false, organization: null });

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [permanentDeleteLoading, setPermanentDeleteLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] =
    useState("all");
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
      key: "organization",
      label: "Organization",
      renderData: (organization) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {organization.orgn_user?.name || "-"}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {(() => {
                const plainText = organization.bio?.description
                  ?.replace(/<[^>]+>/g, "")
                  .trim();

                if (!plainText) {
                  return "No description";
                }

                return plainText.length > 50
                  ? `${plainText.substring(0, 50)}...`
                  : plainText;
              })()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "website",
      label: "Website",
      renderData: (organization) =>
        organization.bio?.website ? (
          <a
            href={organization.bio.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-[#0077ED] dark:text-[#4A9AFF] hover:text-[#0066CC] dark:hover:text-[#6BB6FF] mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Website
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      key: "industry",
      label: "Industry",
      renderData: (organization) => (
        <span className="text-sm text-gray-900 dark:text-white capitalize">
          {organization.bio?.industry || "N/A"}
        </span>
      ),
    },
    {
      key: "total_events",
      label: "Events",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {organization.total_events || 0}
          </span>
        </div>
      ),
    },
    {
      key: "total_companies",
      label: "Companies",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {organization.total_companies || 0}
          </span>
        </div>
      ),
    },

    {
      key: "total_attendees",
      label: "Attendees",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {organization.total_attendees?.toLocaleString() || 0}
          </span>
        </div>
      ),
    },
    {
      key: "total_revenue",
      label: "Revenue",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          {/* <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" /> */}
          <span className="font-medium text-green-600 dark:text-green-400">
            ${organization.total_revenue?.toLocaleString() || 0}
          </span>
        </div>
      ),
    },
    {
      key: "subscription_status",
      label: "Subscription",
      renderData: (organization) =>
        getStatusBadge(organization.subscription_status),
    },
    {
      key: "status",
      label: "Status",
      renderData: (organization) =>
        organization.status ? (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-800 dark:text-green-100 rounded">
            Active
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-800 dark:text-red-100 rounded">
            Inactive
          </span>
        ),
    },

    {
      key: "createdAt",
      label: "Created At",
      renderData: (organization) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {formatDate(organization.createdAt)}
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

  // Load organizations
  const getListOrganizations = async (
    searchQuery = "",
    filters = {},
    includeDeleted = false
  ) => {
    if (includeDeleted) {
      setDeletedLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await _organizations_list_api(
        currentPage,
        rowsPerPage,
        searchQuery,
        filters
      );

      if (result?.code === 200) {
        if (includeDeleted) {
          setDeletedOrganizations(result.data.organizations || []);
        } else {
          setOrganizations(result.data.organizations || []);
          setTotalCount(result.data.pagination.total_count);
          setTotalPages(result.data.pagination.total_pages);
          setFiltersApplied(result.data.filters_applied || {});
        }
      } else {
        enqueueSnackbar(result?.message || "Failed to load organizations", {
          variant: "error",
        });
        if (includeDeleted) {
          setDeletedOrganizations([]);
        } else {
          setOrganizations([]);
        }
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Something went wrong", { variant: "error" });
      if (includeDeleted) {
        setDeletedOrganizations([]);
      } else {
        setOrganizations([]);
      }
    } finally {
      if (includeDeleted) {
        setDeletedLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === "all") {
      getListOrganizations();
    } else if (activeTab === "deleted") {
      getListOrganizations("", {}, true);
    }
  }, [currentPage, rowsPerPage, activeTab]);

  const handleEdit = (organization: Organization) => {
    setEditDialog({ open: true, organization });
    setRowData(organization);
  };

  const handleDelete = (organization: Organization) => {
    setDeleteDialog({ open: true, organization });
    setRowData(organization);
  };

  const handleConfirmDelete = async () => {
    if (!rowData?._id) return;

    setDeleteLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _delete_organization_api(rowData._id);

      // Simulate API response
      const result = {
        code: 200,
        message: "Organization moved to deleted successfully",
      };

      if (result?.code === 200) {
        // Move to deleted organizations (soft delete)
        const deletedOrganization = {
          ...rowData,
          deleted_at: new Date().toISOString(),
          is_deleted: true,
        };

        setDeletedOrganizations((prev) => [deletedOrganization, ...prev]);
        setOrganizations((prev) =>
          prev.filter((org) => org._id !== rowData._id)
        );

        setDeleteDialog({ open: false, organization: null });
        setRowData(null);
        enqueueSnackbar("Organization moved to deleted successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to delete organization", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (data: Partial<Organization>) => {
    if (!rowData?._id) return;

    setEditLoading(true);
    const result = await _edit_organizations_api(rowData._id, data);

    if (result?.code === 200) {
      setEditDialog({ open: false, organization: null });
      setRowData(null);
      setEditLoading(false);
      setOrganizations((prev) =>
        prev.map((org) =>
          org._id === rowData._id ? { ...org, ...result.data } : org
        )
      );
      enqueueSnackbar("Organization updated successfully", {
        variant: "success",
      });
    } else {
      setEditLoading(false);
      enqueueSnackbar(result?.message || "Failed to update organization", {
        variant: "error",
      });
    }
    setEditLoading(false);
  };

  const handleAddNewOrganization = async (data: Partial<Organization>) => {
    setAddLoading(true);
    const result = await _add_organization_api(data);
    if (result?.code === 200) {
      setOrganizations((prev) => [result.organization_user, ...prev]);
      setCreateDialog(false);
      enqueueSnackbar("Organization created successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result?.message || "Failed to create organization", {
        variant: "error",
      });
      setAddLoading(false);
    }
    setAddLoading(false);
  };

  const handleRestore = async (organization: Organization) => {
    setRestoreLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _restore_organization_api(organization._id);

      // Simulate API response
      const result = {
        code: 200,
        message: "Organization restored successfully",
      };

      if (result?.code === 200) {
        const { deleted_at, is_deleted, ...restoredOrganization } =
          organization;
        setOrganizations((prev) => [restoredOrganization, ...prev]);
        setDeletedOrganizations((prev) =>
          prev.filter((org) => org._id !== organization._id)
        );
        enqueueSnackbar("Organization restored successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to restore organization", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error restoring organization:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setRestoreLoading(false);
    }
  };

  const handlePermanentDelete = async (organization: Organization) => {
    setPermanentDeleteLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _permanent_delete_organization_api(organization._id);

      // Simulate API response
      const result = { code: 200, message: "Organization permanently deleted" };

      if (result?.code === 200) {
        setDeletedOrganizations((prev) =>
          prev.filter((org) => org._id !== organization._id)
        );
        enqueueSnackbar("Organization permanently deleted", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(
          result?.message || "Failed to permanently delete organization",
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      console.error("Error permanently deleting organization:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setPermanentDeleteLoading(false);
    }
  };

  const handleRowClick = (organization: Organization) => {
    setDetailView({ open: true, organization });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getListOrganizations(searchQuery);
  };

  // Filter functions
  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (categoryFilter !== "all") count++;
    if (subscriptionStatusFilter !== "all") count++;
    if (activeOnly) count++;
    if (createdFrom || createdTo) count += 1;

    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSubscriptionStatusFilter("all");
    setActiveOnly(false);
    setCreatedFrom("");
    setCreatedTo("");
    setFilterDrawerOpen(false);
    getListOrganizations();
  };

  const handleApplyFilters = () => {
    const filters: { [key: string]: string } = {};

    if (statusFilter === "active") filters.status = "true";
    else if (statusFilter === "inactive") filters.status = "false";

    if (categoryFilter !== "all") filters.category = categoryFilter;
    if (subscriptionStatusFilter !== "all")
      filters.subscription_status = subscriptionStatusFilter;
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

    getListOrganizations(searchQuery, filters);
    setFilterDrawerOpen(false);
  };

  // Helper functions for soft delete table
  const getItemName = (org: Organization) => org.orgn_user.name;
  const getDeletedAt = (org: Organization) => org.deleted_at || "";
  const getDaysUntilPermanentDelete = (org: Organization) => {
    if (!org.deleted_at) return 30;

    const deletedDate = new Date(org.deleted_at);
    const permanentDeleteDate = new Date(
      deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const now = new Date();
    const daysLeft = Math.ceil(
      (permanentDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    );

    return Math.max(0, daysLeft);
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: "Active",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      inactive: {
        label: "Inactive",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      },
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      expired: {
        label: "Expired",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading && organizations.length === 0) {
    return <TableSkeleton rows={8} columns={8} showFilters={true} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Organizations
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Manage and monitor all organizations on your platform
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
            Add Organization
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative w-full flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search organizations..."
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
                    getListOrganizations(""); // reset to no search
                  }}
                  variant="outline"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Clear
                </Button>
              ) : (
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  disabled={searchQuery === ""}
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

      {/* Organizations Table */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Organizations ({organizations.length})
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:text-red-500"
            value="deleted"
          >
            Deleted Organizations ({deletedOrganizations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <CustomTable
            data={organizations}
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
            onRowClick={handleRowClick}
            loading={loading}
            emptyMessage="No organizations found"
          />
        </TabsContent>

        <TabsContent value="deleted" className="space-y-6">
          <SoftDeleteTable
            data={deletedOrganizations}
            loading={deletedLoading}
            emptyMessage="No deleted organizations found"
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
            getItemName={getItemName}
            getDeletedAt={getDeletedAt}
            getDaysUntilPermanentDelete={getDaysUntilPermanentDelete}
            restoreLoading={restoreLoading}
            deleteLoading={permanentDeleteLoading}
            pagination={{
              total_count: totalCount,
              rows_per_page: rowsPerPage,
              page: currentPage,
              handleChangePage,
              onRowsPerPageChange,
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, organization: null })}
        title="Move to Deleted Organizations"
        content={`Are you sure you want to move "${deleteDialog.organization?.orgn_user.name}" to deleted organizations? You can restore it within 30 days before it's permanently deleted.`}
        confirmButtonText="Move to Deleted"
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
      {/* Add/Edit Organization Dialog */}
      <OrganizationAddEditDialog
        open={editDialog.open}
        onOpenChange={(open) => {
          setEditDialog({ open, organization: null });
          if (!open) setRowData(null);
        }}
        organization={rowData} // pass for edit
        onSave={handleSaveEdit}
        loading={editLoading}
      />
      {/* Add */}
      <OrganizationAddEditDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleAddNewOrganization}
        loading={addLoading}
      />
      {/* Organization Detail View */}
      {detailView.open && detailView.organization && (
        <OrganizationDetailView
          open={detailView.open}
          organizationId={detailView.organization._id}
          onClose={() => setDetailView({ open: false, organization: null })}
        />
      )}

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="organizations"
        title="Organizations"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Organizations"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
        applyButtonDisabled={isDateRangeInvalid}
      >
        <OrganizationFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          subscriptionStatusFilter={subscriptionStatusFilter}
          setSubscriptionStatusFilter={setSubscriptionStatusFilter}
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

export default OrganizationsPage;
