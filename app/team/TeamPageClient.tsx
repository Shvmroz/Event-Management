"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Mail,
  Key,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import CustomTable, {
  TableHeader,
  MenuOption,
} from "@/components/ui/custom-table";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import TeamMemberEditDialog from "@/components/team/TeamMemberEditDialog";
import TeamMemberCreateDialog from "@/components/team/TeamMemberCreateDialog";
import ChangePasswordDialog from "@/components/team/ChangePasswordDialog";
import CustomDrawer from "@/components/ui/custom-drawer";
import TeamFilters from "@/components/team/TeamFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CsvExportDialog from "@/components/ui/csv-export-dialog";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import {
  _add_admin_team_api,
  _admin_team_list_api,
  _change_team_member_password_api,
  _delete_team_member_api,
  _edit_team_member_api,
} from "@/DAL/adminTeamAPI";
import { useSnackbar } from "notistack";
import { s3baseUrl } from "@/config/config";

interface TeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  access: string[];
  status: boolean;
  createdAt: string;
  profile_image?: string;
}

const TeamPageClient: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [rowData, setRowData] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);

  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const [filtersApplied, setFiltersApplied] = useState({
    search: "",
    sort_by: "createdAt",
    sort_order: "desc",
    page: 1,
    limit: 50,
  });
  // Local pagination (handled fully by frontend)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Table helpers
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1); // reset to first page
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
      key: "user",
      label: "User",
      renderData: (row) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden">
            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-gray-200 flex items-center justify-center">
              {row.profile_image ? (
                <img
                  src={s3baseUrl + row.profile_image}
                  alt={`${row.first_name} ${row.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {row.first_name} {row.last_name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "access",
      label: "Module Access",
      renderData: (row) => (row.access ? getModuleAccess(row.access) : null),
    },
    {
      key: "status",
      label: "Status",
      renderData: (row) =>
        row.status !== undefined ? getStatusBadge(row.status) : null,
    },
    {
      key: "createdAt",
      label: "Created",
      renderData: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.createdAt ? formatDate(row.createdAt) : "-"}
        </span>
      ),
    },
    {
      key: "action",
      label: "",
      type: "action",
    },
  ];

  const handleDelete = (member: TeamMember) => {
    setDeleteDialog({ open: true, member });
    setRowData(member);
  };

  // delete
  const handleConfirmDelete = async () => {
    if (!rowData?._id) {
      return;
    }
    setDeleteLoading(true);
    const result = await _delete_team_member_api(rowData._id);
    if (result?.code === 200) {
      enqueueSnackbar("Team member deleted successfully", {
        variant: "success",
      });
      setTeamMembers((prev) =>
        prev.filter((member) => member._id !== rowData._id)
      );
      setDeleteDialog({ open: false, member: null });
      setRowData(null);
    } else {
      enqueueSnackbar(result?.message || "Failed to delete team member", {
        variant: "error",
      });
    }

    setDeleteLoading(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditDialog({ open: true, member });
    setRowData(member);
  };

  const handleSaveEdit = async (data: Partial<TeamMember>) => {
    console.log("Edit Data:", data);
    if (!rowData?._id) return;
    setEditLoading(true);
    const result = await _edit_team_member_api(rowData._id, data);
    if (result?.code === 200) {
      setEditDialog({ open: false, member: null });
      setEditLoading(false);
      setTeamMembers((prev) =>
        prev.map((x) =>
          x._id === rowData._id ? { ...x, ...result?.admin } : x
        )
      );
      setRowData(null);

      enqueueSnackbar("Team member updated successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result?.message || "Failed to update team member", {
        variant: "error",
      });
      setEditLoading(false);
    }
  };

  const handleAddNewMember = async (data: Partial<TeamMember>) => {
    setAddLoading(true);

    const result = await _add_admin_team_api(data);

    if (result?.code === 200) {
      setTeamMembers((prev) => [result.admin, ...prev]);
      setCreateDialog(false);
      enqueueSnackbar("Admin member added successfully", {
        variant: "success",
      });
      setAddLoading(false);
    } else {
      enqueueSnackbar(result?.message || "New admin member add failed", {
        variant: "error",
      });
      setAddLoading(false);
    }
  };

  const handleChangePassword = (member: TeamMember) => {
    setRowData(member);
    setChangePasswordDialog({ open: true, member });
  };

  const handlePasswordChange = async (data: { new_password: string }) => {
    if (!rowData?._id) {
      return;
    }
    setPasswordLoading(true);
    const result = await _change_team_member_password_api(rowData._id, data);

    if (result?.code === 200) {
      setPasswordLoading(false);
      setChangePasswordDialog({ open: false, member: null });
      enqueueSnackbar("Password changed successfully", { variant: "success" });
    } else {
      setPasswordLoading(false);
      enqueueSnackbar(result?.message || "Password change failed", {
        variant: "error",
      });
    }
  };

  const getListTeamMembers = async (
    searchQuery?: string,
    filters?: { [key: string]: string }
  ) => {
    setLoading(true);
    const result = await _admin_team_list_api(
      currentPage,
      rowsPerPage,
      searchQuery || "",
      filters || {}
    );

    if (result?.code === 200) {
      setTeamMembers(result.data.admins || []);
      setTotalCount(result.data.pagination.total_count);
      setTotalPages(result.data.pagination.total_pages);
      setFiltersApplied(result.data.filters_applied || filtersApplied);
    } else {
      enqueueSnackbar(result?.message || "Failed to load team members", {
        variant: "error",
      });
      setTeamMembers([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getListTeamMembers(searchQuery);
  };

  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count += 1;
    if (createdFrom || createdTo) count += 1;
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

    getListTeamMembers(searchQuery, filters);
    setFilterDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setCreatedFrom("");
    setCreatedTo("");
    getListTeamMembers();
    setFilterDrawerOpen(false);
  };

  const MENU_OPTIONS: MenuOption[] = [
    { label: "Edit", action: handleEdit, icon: <Edit className="w-4 h-4" /> },
    {
      label: "Change Password",
      action: handleChangePassword,
      icon: <Key className="w-4 h-4" />,
    },
    {
      label: "Delete",
      action: handleDelete,
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
    },
  ];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getModuleAccess = (access: string[]) => {
    const moduleLabels: Record<string, string> = {
      dashboard: "Dashboard",
      organizations: "Organizations",
      companies: "Companies",
      events: "Events",
      payment_plans: "Payment Plans",
      email_templates: "Email Templates",
      analytics: "Analytics",
      team: "Team",
      configuration: "Configuration",
      settings: "Settings",
    };
    return (
      <div className="flex flex-wrap gap-1">
        {access.slice(0, 3).map((module, i) => (
          <Badge
            key={i}
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs"
          >
            {moduleLabels[module] || module}
          </Badge>
        ))}
        {access.length > 3 && (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
            +{access.length - 3} more
          </Badge>
        )}
      </div>
    );
  };

  useEffect(() => {
    getListTeamMembers();
  }, [currentPage, rowsPerPage]);
  // =============================================================================================
  const getStatusBadge = (status: boolean) =>
    status ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 ">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );

  if (loading && teamMembers.length === 0) {
    return <TableSkeleton rows={8} columns={5} showFilters={true} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage team members and their module access permissions
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
            Add Team Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative w-full flex">
              {/* Input with left icon */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-24"
                />
              </div>

              {/* Search Button */}
              {filtersApplied?.search && filtersApplied.search !== "" ? (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    getListTeamMembers(""); // reset to no search
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

      {/* Team Members Table */}
      <CustomTable
        data={teamMembers}
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
        loading={loading}
        emptyMessage="No team members found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, member: null })}
        title="Delete Team Member"
        content={`Are you sure you want to delete "${
          deleteDialog.member
            ? `${deleteDialog.member.first_name} ${deleteDialog.member.last_name}`
            : ""
        }"?`}
        confirmButtonText="Delete"
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Team Member Dialog */}
      <TeamMemberEditDialog
        open={editDialog.open}
        onOpenChange={(open) => {
          setEditDialog({ open, member: null });
          if (!open) setRowData(null);
        }}
        member={rowData}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Team Member Dialog */}
      <TeamMemberCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleAddNewMember}
        loading={addLoading}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordDialog.open}
        onOpenChange={(open) => setChangePasswordDialog({ open, member: null })}
        member={changePasswordDialog.member}
        onSave={handlePasswordChange}
        loading={passwordLoading}
      />

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="my_team"
        title="Team Members"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Team Members"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
        applyButtonDisabled={isDateRangeInvalid}
      >
        <TeamFilters
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

export default TeamPageClient;
