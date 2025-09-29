import React from "react";
import SearchableSelect from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const subscriptionStatusOptions = [
  { value: "all", label: "All Subscriptions" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

interface OrganizationFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;

  subscriptionStatusFilter: string;
  setSubscriptionStatusFilter: (value: string) => void;
  createdFrom?: string;
  setCreatedFrom?: (value: string) => void;
  createdTo?: string;
  setCreatedTo?: (value: string) => void;
  isDateRangeInvalid?: boolean;
}

const OrganizationFilters: React.FC<OrganizationFiltersProps> = ({
  statusFilter,
  setStatusFilter,

  subscriptionStatusFilter,
  setSubscriptionStatusFilter,
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

      {/* Subscription Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subscription Status
        </label>
        <SearchableSelect
          options={subscriptionStatusOptions}
          value={subscriptionStatusFilter}
          onChange={setSubscriptionStatusFilter}
          placeholder="Filter by subscription"
          
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Start Date
        </label>
        <Input
          type="date"
          value={createdFrom}
          onChange={(e) => setCreatedFrom?.(e.target.value)}
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          End Date
        </label>
        <Input
          type="date"
          value={createdTo}
          onChange={(e) => setCreatedTo?.(e.target.value)}
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

export default OrganizationFilters;
