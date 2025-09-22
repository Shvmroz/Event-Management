"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, XCircle, Mail, Tag, AlertTriangle } from "lucide-react";

interface EmailTemplateFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  activeOnly: boolean;
  setActiveOnly: (value: boolean) => void;
  createdFrom?: string;
  setCreatedFrom?: (value: string) => void;
  createdTo?: string;
  setCreatedTo?: (value: string) => void;
  isDateRangeInvalid?: boolean;
}

const EmailTemplateFilters: React.FC<EmailTemplateFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  activeOnly,
  setActiveOnly,
  createdFrom,
  setCreatedFrom,
  createdTo,
  setCreatedTo,
  isDateRangeInvalid,
}) => {
  const templateTypes = [
    'user_registration',
    'event_registration',
    'password_reset',
    'event_reminder',
    'payment_confirmation',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Active Templates Only
          </span>
        </div>
        <Switch
          checked={activeOnly}
          onCheckedChange={setActiveOnly}
          className="data-[state=checked]:bg-[#0077ED]"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Active
              </div>
            </SelectItem>
            <SelectItem value="inactive">
              <div className="flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                Inactive
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Template Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Template Type
        </label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {templateTypes.map(type => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                  {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

export default EmailTemplateFilters;