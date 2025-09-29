import React from "react";
import SearchableSelect from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Globe,  AlertTriangle } from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

interface EventFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  paidOnlyFilter: boolean;
  setPaidOnlyFilter: (value: boolean) => void;
  publicOnlyFilter: boolean;
  setPublicOnlyFilter: (value: boolean) => void;
  createdFrom?: string;
  setCreatedFrom?: (value: string) => void;
  createdTo?: string;
  setCreatedTo?: (value: string) => void;
  isDateRangeInvalid?: boolean;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  paidOnlyFilter,
  setPaidOnlyFilter,
  publicOnlyFilter,
  setPublicOnlyFilter,
  createdFrom,
  setCreatedFrom,
  createdTo,
  setCreatedTo,
  isDateRangeInvalid,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Paid Events Only
          </span>
        </div>
        <Switch
          checked={paidOnlyFilter}
          onCheckedChange={setPaidOnlyFilter}
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Public Events Only
          </span>
        </div>
        <Switch
          checked={publicOnlyFilter}
          onCheckedChange={setPublicOnlyFilter}
        />
      </div>

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


      {/* Date Range Filter */}
      {setCreatedFrom && setCreatedTo && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <Input
            type="date"
            value={createdFrom}
            onChange={(e) => setCreatedFrom(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
      )}
    </div>
  );
};

export default EventFilters;