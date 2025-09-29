import React from "react";
import SearchableSelect from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import {  AlertTriangle } from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "recurring", label: "Recurring" },
  { value: "one-time", label: "One time" },
];

const billingCycleOptions = [
  { value: "all", label: "All Cycles" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

interface PaymentPlanFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  billingCycleFilter: string;
  setBillingCycleFilter: (value: string) => void;
  createdFrom: string;
  setCreatedFrom: (value: string) => void;
  createdTo: string;
  setCreatedTo: (value: string) => void;
  isDateRangeInvalid: boolean;
}

const PaymentPlanFilters: React.FC<PaymentPlanFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  billingCycleFilter,
  setBillingCycleFilter,
  createdFrom,
  setCreatedFrom,
  createdTo,
  setCreatedTo,
  isDateRangeInvalid,
}) => {
  return (
    <div className="space-y-6">
    

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <SearchableSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
          
        />
      </div>

      {/* Plan Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Plan Type
        </label>
        <SearchableSelect
          options={typeOptions}
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="Filter by type"
          
        />
      </div>

      {/* Billing Cycle Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Billing Cycle
        </label>
        <SearchableSelect
          options={billingCycleOptions}
          value={billingCycleFilter}
          onChange={setBillingCycleFilter}
          placeholder="Filter by billing cycle"
          
        />
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Start Date
        </label>
        <Input
          type="date"
          value={createdFrom}
          onChange={(e) => setCreatedFrom(e.target.value)}
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:bg">
          End Date
        </label>
        <Input
          type="date"
          value={createdTo}
          onChange={(e) => setCreatedTo(e.target.value)}
        />
        {isDateRangeInvalid && (
          <div className="flex items-center text-xs text-orange-400 mt-1">
            <AlertTriangle className="w-4 h-4 mr-1 text-orange-400" />
            End date cannot be earlier than start date
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPlanFilters;