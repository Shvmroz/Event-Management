"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import QuillEditor from "@/components/ui/quillEditor/quillEditor";
const QuillEditor = lazy(
  () => import("@/components/ui/quillEditor/quillEditor")
);

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, CreditCard } from "lucide-react";

interface PaymentPlan {
  _id?: string;
  plan_name: string;
  description: string;
  plan_type: string;
  billing_cycle: string;
  price: number | string;
  max_events: number | string;
  max_attendees: number | string;
  max_companies: number | string;
  is_active: boolean;
  is_popular: boolean;
  trial_days: number | string;
}

interface PaymentPlansAddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: PaymentPlan | null; // null = create mode
  onSave: (plan: any) => void;
  loading?: boolean;
}

const billingCycles = ["weekly", "monthly", "yearly"];
const planTypes = [
  { value: "recurring", label: "Recurring" },
  { value: "one_time", label: "One-time" },
];

const PaymentPlansAddEditDialog: React.FC<PaymentPlansAddEditDialogProps> = ({
  open,
  onOpenChange,
  plan,
  onSave,
  loading = false,
}) => {
  const { darkMode } = useAppContext();
  const isEdit = Boolean(plan);

  const [formData, setFormData] = useState<PaymentPlan>({
    plan_name: "",
    description: "",
    plan_type: "recurring",
    billing_cycle: "monthly",
    price: "",
    max_events: "",
    max_attendees: "",
    max_companies: "",
    trial_days: "",
    is_active: true,
    is_popular: false,
  });

  useEffect(() => {
    if (isEdit && plan) {
      setFormData({
        plan_name: plan.plan_name,
        description: plan.description,
        plan_type: plan.plan_type,
        billing_cycle: plan.billing_cycle,
        price: plan.price ?? "",
        max_events: plan.max_events ?? "",
        max_attendees: plan.max_attendees ?? "",
        max_companies: plan.max_companies ?? "",
        trial_days: plan.trial_days ?? "",
        is_active: plan.is_active,
        is_popular: plan.is_popular,
      });
    } else {
      // reset on create mode
      setFormData({
        plan_name: "",
        description: "",
        plan_type: "recurring",
        billing_cycle: "monthly",
        price: "",
        max_events: "",
        max_attendees: "",
        max_companies: "",
        trial_days: "",
        is_active: true,
        is_popular: false,
      });
    }
  }, [plan, isEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reqData = {
      ...formData,
      price: formData.price === "" ? 0 : Number(formData.price),
      max_events: formData.max_events === "" ? 0 : Number(formData.max_events),
      max_attendees:
        formData.max_attendees === "" ? 0 : Number(formData.max_attendees),
      max_companies:
        formData.max_companies === "" ? 0 : Number(formData.max_companies),
      trial_days: formData.trial_days === "" ? 0 : Number(formData.trial_days),
    };

    onSave(reqData);
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          borderRadius: "12px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle style={{ color: darkMode ? "#ffffff" : "#000000" }}>
        <div className="flex items-center">
          {!isEdit && <CreditCard className="w-5 h-5 mr-2 text-[#0077ED]" />}
          {isEdit ? "Edit Payment Plan" : "Create Payment Plan"}
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          id="payment-plan-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Plan Name *
              </label>
              <Input
                value={formData.plan_name}
                onChange={(e) =>
                  setFormData({ ...formData, plan_name: e.target.value })
                }
                placeholder="Enter plan name"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Plan Type *
              </label>
              <Select
                value={formData.plan_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, plan_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Billing Cycle *
              </label>
              <Select
                value={formData.billing_cycle}
                onValueChange={(value) =>
                  setFormData({ ...formData, billing_cycle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {billingCycles.map((cycle) => (
                    <SelectItem key={cycle} value={cycle}>
                      {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Events */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Events *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.max_events}
                onChange={(e) =>
                  setFormData({ ...formData, max_events: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>

            {/* Max Attendees */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Attendees *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.max_attendees}
                onChange={(e) =>
                  setFormData({ ...formData, max_attendees: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>

            {/* Max Companies */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Companies *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.max_companies}
                onChange={(e) =>
                  setFormData({ ...formData, max_companies: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>

            {/* Trial Days */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Trial Days *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.trial_days}
                onChange={(e) =>
                  setFormData({ ...formData, trial_days: e.target.value })
                }
                placeholder="Enter Days"
                required
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6 items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 rounded border border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium cursor-pointer"
                >
                  Active Plan
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_popular"
                  checked={formData.is_popular}
                  onChange={(e) =>
                    setFormData({ ...formData, is_popular: e.target.checked })
                  }
                  className="w-4 h-4 rounded border border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="is_popular"
                  className="text-sm font-medium cursor-pointer"
                >
                  Popular Plan
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Suspense fallback={<div>Loading editor...</div>}>
              <QuillEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Enter plan description"
                rows={4}
              />
            </Suspense>
          </div>
        </form>
      </DialogContent>

      <DialogActions
        sx={{ borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}` }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          form="payment-plan-form"
          type="submit"
          disabled={
            loading || !formData.description.replace(/<[^>]*>/g, "").trim()
          }
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              {isEdit ? "Saving..." : "Creating..."}
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? "Save Changes" : "Create Plan"}
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPlansAddEditDialog;
