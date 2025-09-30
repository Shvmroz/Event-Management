import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Globe,
  Clock,
  Users,
  DollarSign,
  ExternalLink,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { useAppContext } from "@/contexts/AppContext";
import { useSnackbar } from "notistack";
import { _event_detail_view_api } from "@/DAL/eventAPI";
import { formatDateTime } from "@/utils/dateUtils.js";
import Button from "@/components/ui/custom-button";

interface EventDetailViewProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({
  open,
  onClose,
  eventId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { darkMode } = useAppContext();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const getEventDetail = async (id: string) => {
    setLoading(true);
    const result = await _event_detail_view_api(id);
    if (result?.code === 200) {
      setEvent(result?.data);
    } else {
      enqueueSnackbar(result?.message || "Failed to fetch event", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && eventId) {
      getEventDetail(eventId);
    }
  }, [open, eventId]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: {
        label: "Published",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      draft: {
        label: "Draft",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      cancelled: {
        label: "Cancelled",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      },
      completed: {
        label: "Completed",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getVenueTypeBadge = (type: string) => {
    const typeConfig = {
      physical: {
        label: "Physical",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        icon: <MapPin className="w-3 h-3 mr-1" />,
      },
      virtual: {
        label: "Virtual",
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
        icon: <Globe className="w-3 h-3 mr-1" />,
      },
      hybrid: {
        label: "Hybrid",
        className:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
        icon: <Calendar className="w-3 h-3 mr-1" />,
      },
    };

    const config =
      typeConfig[type as keyof typeof typeConfig] || typeConfig.physical;

    return (
      <Badge className={config.className}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };


  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <CustomDialogTitle onClose={onClose}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {event?.title}
              </h1>
            </div>
          </div>
    
        </div>
      </CustomDialogTitle>

      <CustomDialogContent dividers className="space-y-4">
        {/* Event Information + Pricing + Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <Info className="w-4 h-4 mr-2 text-[#0077ED]" />
              Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-medium mb-1">Visibility</label>
                {event?.is_public ? (
                  <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 flex items-center w-20">
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800 text-xs px-2 py-1 w-20">
                    Private
                  </Badge>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Status & Venue Type
                </label>
                <div className="flex items-center space-x-1 mt-1 text-xs">
                  {event?.status && getStatusBadge(event.status)}
                  {event?.venue?.type && getVenueTypeBadge(event.venue.type)}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="font-semibold text-sm">
                    {event?.max_attendees || "-"}
                  </div>
                  <div className="text-xs text-gray-500">Max Attendees</div>
                </div>
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="font-semibold text-sm">
                    {event?.isPaidEvent
                      ? formatCurrency(event.ticketPrice, event.currency)
                      : "Free"}
                  </div>
                  <div className="text-xs text-gray-500">Ticket Price</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="font-semibold text-sm">
                    {event?.startAt && event?.endAt
                      ? Math.ceil(
                          (new Date(event.endAt).getTime() -
                            new Date(event.startAt).getTime()) /
                            (1000 * 60 * 60)
                        ) + "h"
                      : "-"}
                  </div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {(() => {
                  const plainText = event?.description
                    ?.replace(/<[^>]+>/g, "")
                    .trim();
                  if (!plainText) return "No description";
                  return plainText.length > 50
                    ? `${plainText.substring(0, 50)}...`
                    : plainText;
                })()}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700" />

            <div className="space-y-2 text-sm">
              <div className="flex items-center font-medium">
                Venue Address
              </div>

              {(event?.venue?.type === "physical" ||
                event?.venue?.type === "hybrid") && (
                <div>
                  <div className=" text-gray-600">{event?.venue?.address}</div>
                  <div className=" text-gray-600">
                    {event?.venue?.city}, {event?.venue?.state},{" "}
                    {event?.venue?.country} {event?.venue?.postal_code}
                  </div>
                </div>
              )}

              {(event?.venue?.type === "virtual" ||
                event?.venue?.type === "hybrid") && (
                <div>
                  <div >{event?.venue?.platform}</div>
                  {event?.venue?.virtual_link && (
                    <a
                      href={event.venue.virtual_link}
                      target="_blank"
                      className="inline-flex items-center text-blue-600 text-sm"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {event.venue.virtual_link}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <Clock className="w-4 h-4 mr-2 text-[#0077ED]" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="relative flex flex-col items-start pl-6">
              <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-blue-300 dark:bg-gray-600"></div>

              <div className="flex items-center mb-6">
                <div className="pe-3 ps-2 py-1 rounded-md bg-blue-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-medium text-sky-800">
                    Start:
                  </span>
                  <span>
                    {event?.startAt ? formatDateTime(event.startAt) : "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="pe-3 ps-2 py-1 rounded-md bg-orange-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-800">
                    End:
                  </span>
                  <span>
                    {event?.endAt ? formatDateTime(event.endAt) : "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="pe-3 ps-2 py-1 rounded-md bg-red-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-medium text-red-800">
                    Deadline:
                  </span>
                  <span>
                    {event?.registration_deadline
                      ? formatDateTime(event.registration_deadline)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Close
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default EventDetailView;
