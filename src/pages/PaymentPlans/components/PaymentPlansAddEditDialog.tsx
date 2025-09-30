import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import QuillEditor from "@/components/ui/quillEditor/quillEditor";

import SearchableSelect from "@/components/ui/searchable-select";
import { Save, X, CreditCard } from "lucide-react";
import StatusSwitch from "@/components/ui/status-switch";
import { Switch } from "@/components/ui/switch";
import Button from "@/components/ui/custom-button";

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

const billingCycles = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];
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
    <CustomDialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
    >
      <CustomDialogTitle onClose={() => onOpenChange(false)}>
        <div className="flex items-center">
          {!isEdit && <CreditCard className="w-5 h-5 mr-2 text-[#0077ED]" />}
          {isEdit ? "Edit Payment Plan" : "Create Payment Plan"}
        </div>
      </CustomDialogTitle>

      <CustomDialogContent>
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
              <SearchableSelect
                options={planTypes}
                value={formData.plan_type}
                onChange={(value) =>
                  setFormData({ ...formData, plan_type: value })
                }
                placeholder="Select plan type"
              />
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Billing Cycle *
              </label>
              <SearchableSelect
                options={billingCycles}
                value={formData.billing_cycle}
                onChange={(value) =>
                  setFormData({ ...formData, billing_cycle: value })
                }
                placeholder="Select billing cycle"
              />
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Plan Status
              </label>
              <StatusSwitch
                value={formData.is_active}
                onChange={(is_active) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Plan Visibility
              </label>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md h-10">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Popular Plan
                </span>
                <Switch
                  checked={formData.is_popular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_popular: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <QuillEditor
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              placeholder="Enter plan description"
              rows={4}
            />
          </div>
        </form>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          variant="outlined"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          form="payment-plan-form"
          type="submit"
          disabled={
            loading || !formData.description.replace(/<[^>]*>/g, "").trim()
          }
          variant="contained"
          color="primary"
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
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default PaymentPlansAddEditDialog;
