import React, { useState, useEffect, Suspense, lazy } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/ui/searchable-select";
import StatusSwitch from "@/components/ui/status-switch";
import { Switch } from "@/components/ui/switch";
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

const venueTypes = [
  { value: "physical", label: "Physical" },
  { value: "virtual", label: "Virtual" },
  { value: "hybrid", label: "Hybrid" },
];
const statuses = [
  { value: "published", label: "Published" },
  { value: "cancelled", label: "Cancelled" },
];
const platforms = [
  { value: "Zoom", label: "Zoom" },
  { value: "Google Meet", label: "Google Meet" },
  { value: "Microsoft Teams", label: "Microsoft Teams" },
  { value: "WebEx", label: "WebEx" },
  { value: "Other", label: "Other" },
];

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
        currency: "USD",
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
    if (open && !event) {
      getOrgList();
    }
  }, [open]);

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
    <CustomDialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
    >
      <CustomDialogTitle onClose={() => onOpenChange(false)}>
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[#0077ED]" />
          {isEdit ? "Edit Event" : "Create Event"}
        </div>
      </CustomDialogTitle>

      <CustomDialogContent>
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
              <SearchableSelect
                options={organizations.map((org: any) => ({
                  value: org._id,
                  label: org.orgn_user?.name || "Unnamed Org",
                }))}
                value={formData.organization_id}
                onChange={(value) =>
                  setFormData({ ...formData, organization_id: value })
                }
                placeholder="Select organization"
                disabled={!organizations.length}
                search={true}
              />
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
            <SearchableSelect
              options={venueTypes}
              value={formData.venue.type}
              onChange={(value) => updateVenue("type", value)}
              placeholder="Select venue type"
              
            />
          </div>

          {/* Physical Venue Fields */}
          {(formData.venue.type === "physical" ||
            formData.venue.type === "hybrid") && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium mb-2">
                    State
                  </label>
                  <Input
                    value={formData.venue.state}
                    onChange={(e) => updateVenue("state", e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </>
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
                <SearchableSelect
                  options={platforms}
                  value={formData.venue.platform}
                  onChange={(value) => updateVenue("platform", value)}
                  placeholder="Select platform"
                  
                />
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
                <StatusSwitch
                  value={formData.status === "published"}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value ? "published" : "draft",
                    })
                  }
                  activeLabel="Published"
                  inactiveLabel="Draft"
                />
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
            {/* Event Type Switches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paid Event */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type
                </label>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md h-10">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.isPaidEvent ? "Paid Event" : "Free Event"}
                  </span>
                  <Switch
                    checked={formData.isPaidEvent}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPaidEvent: checked })
                    }
                  />
                </div>
              </div>

              {/* Public Event */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Visibility
                </label>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md h-10">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.is_public ? "Public Event" : "Private Event"}
                  </span>
                  <Switch
                    checked={formData.is_public}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_public: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Show only if Paid Event is true */}
            {formData.isPaidEvent && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-blue-200 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Payment Settings
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ticket Price (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        $
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.ticketPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ticketPrice: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        className="pl-8"
                        required
                        style={{
                          backgroundColor: darkMode ? "#374151" : "#ffffff",
                          color: darkMode ? "#ffffff" : "#000000",
                          borderColor: darkMode ? "#4b5563" : "#d1d5db",
                        }}
                      />
                    </div>
                  </div>
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
      </CustomDialogContent>

      <CustomDialogActions>
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
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default EventsAddEditDialog;
