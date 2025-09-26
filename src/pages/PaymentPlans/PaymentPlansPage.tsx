import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Users,
  Building,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  CalendarFold,
} from "lucide-react";
import CustomTable, {
  TableHeader,
  MenuOption,
} from "@/components/ui/custom-table";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";

import CustomDrawer from "@/components/ui/custom-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CsvExportDialog from "@/components/ui/csv-export-dialog";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { useSnackbar } from "notistack";
import {
  _add_payment_plan_api,
  _delete_payment_plan_api,
  _edit_payment_plan_api,
  _payment_plans_list_api,
} from "@/DAL/paymentPlanAPI";
import PaymentPlansAddEditDialog from "./components/PaymentPlansAddEditDialog";
import PaymentPlanFilters from "./components/PaymentPlanFilters";
import { formatDate } from "@/utils/dateUtils.js";

interface PaymentPlan {
  _id: string;
  plan_name: string;
  description: string;
  plan_type: string;
  billing_cycle: string;
  price: number;
  currency: string;
  max_events: number;
  max_attendees: number;
  max_companies: number;
  is_active: boolean;
  is_popular: boolean;
  trial_days: number;
  createdAt: string;
  updatedAt: string;
}

const PaymentPlansPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  // State
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [rowData, setRowData] = useState<PaymentPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [billingCycleFilter, setBillingCycleFilter] = useState("all");
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
      renderData: (rowData, rowIndex) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {rowIndex !== undefined ? rowIndex + 1 : "-"}.
        </span>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      renderData: (rowData) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <CalendarFold className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {rowData.plan_name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {rowData.description
                ? (() => {
                    const plainText = rowData.description.replace(
                      /<[^>]+>/g,
                      ""
                    ); // remove HTML tags
                    return plainText.length > 50
                      ? `${plainText.substring(0, 50)}...`
                      : plainText;
                  })()
                : "No Description"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "pricing",
      label: "Pricing",
      renderData: (rowData) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(rowData.price, rowData.currency)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "billing_cycle",
      label: "Billing Cycle",
      renderData: (rowData) => (
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 first-letter:uppercase">
          {rowData.billing_cycle}
        </div>
      ),
    },
    {
      key: "plan_type",
      label: "Type",
      renderData: (rowData) => (
        <Badge
          className={
            rowData.plan_type === "recurring"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
          }
        >
          {rowData.plan_type === "one_time"
            ? "One Time"
            : rowData.plan_type.charAt(0).toUpperCase() +
              rowData.plan_type.slice(1)}
        </Badge>
      ),
    },
    {
      key: "max_events",
      label: "Max Events",
      renderData: (rowData) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {rowData.max_events}
          </span>
        </div>
      ),
    },
    {
      key: "max_attendees",
      label: "Max Attendees",
      renderData: (rowData) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {rowData.max_attendees.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "max_companies",
      label: "Max Companies",
      renderData: (rowData) => (
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-orange-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {rowData.max_companies}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderData: (rowData) =>
        getStatusBadge(rowData.is_active, rowData.is_popular),
    },
    {
      key: "trial_days",
      label: "Trial",
      renderData: (rowData) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {rowData.trial_days && rowData.trial_days > 0
              ? `${rowData.trial_days} Days`
              : "No Trial"}
          </span>
        </div>
      ),
    },

    {
      key: "createdAt",
      label: "Created",
      renderData: (rowData) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(rowData.createdAt)}
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

  // Get payment plans list
  const getListPaymentPlans = async (searchQuery = "", filters = {}) => {
    setLoading(true);
    const result = await _payment_plans_list_api(
      currentPage,
      rowsPerPage,
      searchQuery,
      filters
    );

    if (result?.code === 200) {
      setPaymentPlans(result.payment_plans || []);
      setTotalCount(result.pagination.total_count);
      setTotalPages(result.pagination.total_pages);
      setFiltersApplied(result.filters_applied || {});
    } else {
      enqueueSnackbar(result?.message || "Failed to load payment plans", {
        variant: "error",
      });
      setPaymentPlans([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getListPaymentPlans();
  }, [currentPage, rowsPerPage]);

  if (loading && paymentPlans.length === 0) {
    return <TableSkeleton rows={8} columns={9} showFilters={true} />;
  }

  const handleEdit = (plan: PaymentPlan) => {
    setEditDialog(true);
    setRowData(plan);
  };

  const handleDelete = (plan: PaymentPlan) => {
    setDeleteDialog(true);
    setRowData(plan);
  };

  const handleConfirmDelete = async () => {
    if (!rowData?._id) return;

    setDeleteLoading(true);
    const result = await _delete_payment_plan_api(rowData._id);
    if (result?.code === 200) {
      setPaymentPlans((prev) =>
        prev.filter((plan) => plan._id !== rowData._id)
      );
      setDeleteDialog(false);
      setRowData(null);
      enqueueSnackbar("Payment plan deleted successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result?.message || "Failed to delete payment plan", {
        variant: "error",
      });
      setDeleteLoading(false);
    }
    setDeleteLoading(false);
  };

  const handleSaveEdit = async (data: Partial<PaymentPlan>) => {
    console.log("Edit Data:", data);
    if (!rowData?._id) return;
    setEditLoading(true);
    const result = await _edit_payment_plan_api(rowData._id, data);
    if (result?.code === 200) {
      setEditDialog(false);
      setRowData(null);
      setEditLoading(false);
      setPaymentPlans((prev) =>
        prev.map((plan) =>
          plan._id === rowData._id ? { ...plan, ...data } : plan
        )
      );

      enqueueSnackbar("Payment plan updated successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result?.message || "Failed to update payment plan", {
        variant: "error",
      });
      setEditLoading(false);
    }
  };

  const handleAddNewPlan = async (data: Partial<PaymentPlan>) => {
    setAddLoading(true);
    const result = await _add_payment_plan_api(data);

    if (result?.code === 200) {
      setPaymentPlans((prev) => [result.data, ...prev]);
      setCreateDialog(false);
      setAddLoading(false);
      enqueueSnackbar("Payment plan created successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result?.message || "Failed to create payment plan", {
        variant: "error",
      });
      setAddLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getListPaymentPlans(searchQuery);
  };

  // Filter functions
  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count += 1;
    if (typeFilter !== "all") count += 1;
    if (billingCycleFilter !== "all") count += 1;

    if (createdFrom || createdTo) count += 1;

    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setBillingCycleFilter("all");
    setCreatedFrom("");
    setCreatedTo("");
    setFilterDrawerOpen(false);
    getListPaymentPlans();
  };

  const handleApplyFilters = () => {
    const filters: {
      status?: string;
      type?: string;
      billing_cycle?: string;
      created_from?: string;
      created_to?: string;
    } = {};

    if (statusFilter === "active") filters.status = "true";
    else if (statusFilter === "inactive") filters.status = "false";

    if (typeFilter !== "all") filters.type = typeFilter;

    if (billingCycleFilter !== "all")
      filters.billing_cycle = billingCycleFilter;

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

    getListPaymentPlans(searchQuery, filters);
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

  const getStatusBadge = (isActive: boolean, isPopular: boolean) => {
    return (
      <div className="flex items-center space-x-2">
        {isActive ? (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        )}
        {isPopular && (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>
    );
  };


  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage subscription plans and pricing for your platform
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
            Add Payment Plan
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
                  placeholder="Search payment plans..."
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
                    getListPaymentPlans("");
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

      {/* Payment Plans Table */}
      <CustomTable
        data={paymentPlans}
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
        emptyMessage="No payment plans found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog}
        onOpenChange={(open) => {
          setDeleteDialog(open);
          if (!open) setRowData(null);
        }}
        title="Delete Payment Plan"
        content={`Are you sure you want to delete "${rowData?.plan_name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Payment Plan Dialog (Create / Edit) */}
      <PaymentPlansAddEditDialog
        open={editDialog || createDialog}
        onOpenChange={(open) => {
          if (editDialog) {
            // closing edit dialog
            setEditDialog(open);
            if (!open) setRowData(null);
          } else {
            // closing create dialog
            setCreateDialog(open);
          }
        }}
        plan={editDialog ? rowData : null} // pass plan only in edit mode
        onSave={editDialog ? handleSaveEdit : handleAddNewPlan}
        loading={editDialog ? editLoading : addLoading}
      />

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="payment_plans"
        title="Payment Plans"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Payment Plans"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
        applyButtonDisabled={isDateRangeInvalid}
      >
        <PaymentPlanFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          billingCycleFilter={billingCycleFilter}
          setBillingCycleFilter={setBillingCycleFilter}
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

export default PaymentPlansPage;
