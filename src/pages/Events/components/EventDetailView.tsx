"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Globe,
  Clock,
  Users,
  DollarSign,
  ExternalLink,
  X,
  Activity,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { useAppContext } from "@/contexts/AppContext";
import { useSnackbar } from "notistack";
import { _event_detail_view_api } from "@/DAL/eventAPI";

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          overflowY: "hidden",
        },
      }}
    >
      <DialogTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {event?.title}
              </h1>
              <div className="flex items-center space-x-1 mt-1 text-xs">
                {event?.status && getStatusBadge(event.status)}
                {event?.venue?.type && getVenueTypeBadge(event.venue.type)}
              </div>
            </div>
          </div>
          <IconButton onClick={onClose}>
            <X className="w-5 h-5 text-foreground" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers className="space-y-4">
        {/* Event Information + Pricing + Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <Info className="w-4 h-4 mr-2 text-[#0077ED]" />
              Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <label className="block font-medium mb-1">Description</label>
              <div>{event?.description || "-"}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <label className="block font-medium mb-1">Max Attendees</label>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{event?.max_attendees || "-"}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-2">
              <label className="block font-medium mb-1">Pricing</label>
              {event?.isPaidEvent ? (
                <div className="text-sm font-semibold text-green-600">
                  {formatCurrency(event.ticketPrice, event.currency)}
                </div>
              ) : (
                <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                  Free
                </Badge>
              )}
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
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">Start</label>
                <div>
                  {event?.startAt ? formatDateTime(event.startAt) : "-"}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">End</label>
                <div>{event?.endAt ? formatDateTime(event.endAt) : "-"}</div>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Registration Deadline
              </label>
              <div>
                {event?.registration_deadline
                  ? formatDateTime(event.registration_deadline)
                  : "-"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Venue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <MapPin className="w-4 h-4 mr-2 text-[#0077ED]" />
              Venue Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {event?.venue?.type && getVenueTypeBadge(event.venue.type)}

            {(event?.venue?.type === "physical" ||
              event?.venue?.type === "hybrid") && (
              <div>
                <div>{event?.venue?.address}</div>
                <div>
                  {event?.venue?.city}, {event?.venue?.state},{" "}
                  {event?.venue?.country} {event?.venue?.postal_code}
                </div>
              </div>
            )}

            {(event?.venue?.type === "virtual" ||
              event?.venue?.type === "hybrid") && (
              <div>
                <div>{event?.venue?.platform}</div>
                {event?.venue?.virtual_link && (
                  <a
                    href={event.venue.virtual_link}
                    target="_blank"
                    className="inline-flex items-center text-[#0077ED] text-sm"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    {event.venue.virtual_link}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="text-sm">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailView;
