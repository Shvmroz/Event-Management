"use client";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, Calendar } from "lucide-react";
import { _organizations_list_api } from "@/DAL/organizationAPI";
import { useSnackbar } from "notistack";
import Spinner from "@/components/ui/spinner";
const QuillEditor = lazy(
  () => import("@/components/ui/quillEditor/quillEditor")
);

interface EventsAddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: any) => void;
  loading?: boolean;
  event?: any | null;
}

const venueTypes = ["physical", "virtual", "hybrid"];
const statuses = ["published", "cancelled"];
const currencies = ["USD"];
const platforms = ["Zoom", "Google Meet", "Microsoft Teams", "WebEx", "Other"];

const EventsAddEditDialog: React.FC<EventsAddEditDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
  event,
}) => {
  const { darkMode } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(event);
  const [organizations, setOrganizations] = useState<Array<any>>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    venue: {
      type: "physical",
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      virtual_link: "",
      platform: "",
    },
    status: "draft",
    ticketPrice: "",
    currency: "USD",
    isPaidEvent: false,
    max_attendees: "",
    registration_deadline: "",
    is_public: true,
    organization_id: "", // set when adding new event
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      // Edit mode payload
      const reqData = {
        title: formData.title,
        description: formData.description,
        startAt: formData.startAt ? formData.startAt + ":00.000Z" : "",
        endAt: formData.endAt ? formData.endAt + ":00.000Z" : "",
        registration_deadline: formData.registration_deadline
          ? formData.registration_deadline + ":00.000Z"
          : "",
        venue: formData.venue,
        status: formData.status,
        ticketPrice:
          formData.ticketPrice === "" ? 0 : Number(formData.ticketPrice),
        currency: formData.currency,
        isPaidEvent: formData.isPaidEvent,
        max_attendees:
          formData.max_attendees === "" ? 0 : Number(formData.max_attendees),
        is_public: formData.is_public,
        organization_id: formData.organization_id,
      };
      console.log("Update Event Payload:", reqData);
      onSave(reqData);
    } else {
      // Create mode payload
      const reqData = {
        title: formData.title,
        description: formData.description,
        startAt: formData.startAt ? formData.startAt + ":00.000Z" : "",
        endAt: formData.endAt ? formData.endAt + ":00.000Z" : "",
        registration_deadline: formData.registration_deadline
          ? formData.registration_deadline + ":00.000Z"
          : "",
        venue: formData.venue,
        status: formData.status,
        ticketPrice:
          formData.ticketPrice === "" ? 0 : Number(formData.ticketPrice),
        currency: formData.currency,
        isPaidEvent: formData.isPaidEvent,
        max_attendees:
          formData.max_attendees === "" ? 0 : Number(formData.max_attendees),
        is_public: formData.is_public,
        organization_id: formData.organization_id,
      };
      console.log("Create Event Payload:", reqData);
      onSave(reqData);
    }
  };

  const getOrgList = async () => {
    const result = await _organizations_list_api();
    if (result?.code === 200) {
      setOrganizations(result.data.organizations || []);
    } else {
      console.log(result?.message || "Failed to load organizations");
    }
  };

  // Prefill in edit mode
  useEffect(() => {
    if (event) {
      console.log("Event to edit:", event);
      setFormData({
        title: event.title || "",
        description: event.description || "",
        startAt: event.startAt ? event.startAt.slice(0, 16) : "",
        endAt: event.endAt ? event.endAt.slice(0, 16) : "",
        venue: event.venue || {
          type: "physical",
          address: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
          virtual_link: "",
          platform: "",
        },
        status: event.status || "draft",
        ticketPrice: event.ticketPrice ?? "",
        currency: event.currency || "USD",
        isPaidEvent: event.isPaidEvent ?? false,
        max_attendees: event.max_attendees ?? "",
        registration_deadline: event.registration_deadline
          ? event.registration_deadline.slice(0, 16)
          : "",
        is_public: event.is_public ?? true,
        organization_id: (event as any).organization_id || "", // for new events, can be set on add
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startAt: "",
        endAt: "",
        venue: {
          type: "physical",
          address: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
          virtual_link: "",
          platform: "",
        },
        status: "draft",
        ticketPrice: "",
        currency: "USD",
        isPaidEvent: false,
        max_attendees: "",
        registration_deadline: "",
        is_public: true,
        organization_id: "", // set when adding
      });
    }
  }, [event, open]);

  useEffect(() => {
    if(open && !event) {
      getOrgList();
    }
  }, [open])
  

  const updateVenue = (field: string, value: string) => {
    setFormData({
      ...formData,
      venue: {
        ...formData.venue,
        [field]: value,
      },
    });
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    event.preventDefault();
    enqueueSnackbar("Use cancel button to close dialog", {
      variant: "info",
    });
  };

  return (
    <Dialog
      open={open}
      // onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      onBackdropClick={handleBackdropClick}
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>
        <div
          className="flex items-center"
          style={{ color: darkMode ? "#ffffff" : "#000000" }}
        >
          <Calendar className="w-5 h-5 mr-2 text-[#0077ED]" />
          {isEdit ? "Edit Event" : "Create Event"}
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6" id="event-form">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Organization Select */}
          {!isEdit && (
           <div>
           <label className="block text-sm font-medium mb-2">
             Organization *
           </label>
           <Select
             value={formData.organization_id}
             onValueChange={(value) =>
               setFormData({ ...formData, organization_id: value })
             }
             required
             disabled={!organizations.length} // disable until data comes
           >
             <SelectTrigger
               style={{
                 backgroundColor: darkMode ? "#374151" : "#ffffff",
                 color: darkMode ? "#ffffff" : "#000000",
                 borderColor: darkMode ? "#4b5563" : "#d1d5db",
               }}
             >
               {organizations.length === 0 ? (
                 <div className="flex items-center gap-2 text-gray-400">
                   <Spinner size="sm" />
                   Loading organizations list...
                 </div>
               ) : (
                 <SelectValue placeholder="Select organization" />
               )}
             </SelectTrigger>
         
             <SelectContent
               style={{
                 backgroundColor: darkMode ? "#374151" : "#ffffff",
                 color: darkMode ? "#ffffff" : "#000000",
                 borderColor: darkMode ? "#4b5563" : "#d1d5db",
               }}
             >
               {organizations.map((org: any) => (
                 <SelectItem key={org._id} value={org._id}>
                   {org.orgn_user?.name || "Unnamed Org"}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
         
          )}

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.startAt}
                onChange={(e) =>
                  setFormData({ ...formData, startAt: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                End Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.endAt}
                onChange={(e) =>
                  setFormData({ ...formData, endAt: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Registration Deadline *
            </label>
            <Input
              type="datetime-local"
              value={formData.registration_deadline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registration_deadline: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Venue Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Venue Type *
            </label>
            <Select
              value={formData.venue.type}
              onValueChange={(value) => updateVenue("type", value)}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {venueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Physical Venue Fields */}
          {(formData.venue.type === "physical" ||
            formData.venue.type === "hybrid") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <Input
                  value={formData.venue.address}
                  onChange={(e) => updateVenue("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <Input
                  value={formData.venue.city}
                  onChange={(e) => updateVenue("city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Input
                  value={formData.venue.state}
                  onChange={(e) => updateVenue("state", e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>
                <Input
                  value={formData.venue.country}
                  onChange={(e) => updateVenue("country", e.target.value)}
                  placeholder="Enter country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Postal Code
                </label>
                <Input
                  value={formData.venue.postal_code}
                  onChange={(e) => updateVenue("postal_code", e.target.value)}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          )}

          {/* Virtual Venue Fields */}
          {(formData.venue.type === "virtual" ||
            formData.venue.type === "hybrid") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Virtual Link
                </label>
                <Input
                  type="url"
                  value={formData.venue.virtual_link}
                  onChange={(e) => updateVenue("virtual_link", e.target.value)}
                  placeholder="https://zoom.us/j/1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Platform
                </label>
                <Select
                  value={formData.venue.platform}
                  onValueChange={(value) => updateVenue("platform", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Event Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Event Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  required
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: darkMode ? "#374151" : "#ffffff",
                      color: darkMode ? "#ffffff" : "#000000",
                      borderColor: darkMode ? "#4b5563" : "#d1d5db",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: darkMode ? "#374151" : "#ffffff",
                      color: darkMode ? "#ffffff" : "#000000",
                      borderColor: darkMode ? "#4b5563" : "#d1d5db",
                    }}
                  >
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Attendees *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.max_attendees}
                  onChange={(e) =>
                    setFormData({ ...formData, max_attendees: e.target.value })
                  }
                  placeholder="100"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                  required
                />
              </div>
            </div>
            {/* Paid Event Checkbox */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Paid Event */}
              <label
                htmlFor="isPaidEvent"
                className="flex items-center space-x-2 cursor-pointer select-none p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  id="isPaidEvent"
                  checked={formData.isPaidEvent}
                  onChange={(e) =>
                    setFormData({ ...formData, isPaidEvent: e.target.checked })
                  }
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paid Event
                </span>
              </label>

              {/* Public Event */}
              <label
                htmlFor="is_public"
                className="flex items-center space-x-2 cursor-pointer select-none p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) =>
                    setFormData({ ...formData, is_public: e.target.checked })
                  }
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Public Event
                </span>
              </label>
            </div>

            {/* Show only if Paid Event is true */}
            {formData.isPaidEvent && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ticket Price
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.ticketPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, ticketPrice: e.target.value })
                    }
                    placeholder="0.00"
                    style={{
                      backgroundColor: darkMode ? "#374151" : "#ffffff",
                      color: darkMode ? "#ffffff" : "#000000",
                      borderColor: darkMode ? "#4b5563" : "#d1d5db",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                  >
                    <SelectTrigger
                      style={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#ffffff" : "#000000",
                        borderColor: darkMode ? "#4b5563" : "#d1d5db",
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#ffffff" : "#000000",
                        borderColor: darkMode ? "#4b5563" : "#d1d5db",
                      }}
                    >
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

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
          style={{
            backgroundColor: darkMode ? "#374151" : "#f9fafb",
            color: darkMode ? "#f3f4f6" : "#374151",
            borderColor: darkMode ? "#4b5563" : "#d1d5db",
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          form="event-form"
          type="submit"
          disabled={loading || !formData.title || !formData.description}
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white dark:text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              {isEdit ? "Saving..." : "Creating..."}
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? "Save Changes" : "Create Event"}
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventsAddEditDialog;
