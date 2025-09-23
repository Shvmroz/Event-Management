"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Globe,
  Clock,
  Users,
  DollarSign,
  ExternalLink,
  CheckCircle,
  XCircle,
  X,
  Activity,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { useAppContext } from '@/contexts/AppContext';

interface Event {
  _id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  venue: {
    type: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    virtual_link: string;
    platform: string;
  };
  status: string;
  ticketPrice: number;
  currency: string;
  isPaidEvent: boolean;
  max_attendees: number;
  registration_deadline: string;
  is_public: boolean;
  created_at: string;
}

interface EventDetailViewProps {
  event: Event;
  onClose: () => void;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  onClose,
}) => {
  const { darkMode } = useAppContext();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Published', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getVenueTypeBadge = (type: string) => {
    const typeConfig = {
      physical: { label: 'Physical', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: <MapPin className="w-3 h-3 mr-1" /> },
      virtual: { label: 'Virtual', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: <Globe className="w-3 h-3 mr-1" /> },
      hybrid: { label: 'Hybrid', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400', icon: <Calendar className="w-3 h-3 mr-1" /> },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.physical;
    
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
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
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
      open 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          overflowY: 'hidden',
        }
      }}
    >
      <DialogTitle>
        <div className="flex items-center justify-between" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {event.title}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(event.status)}
                {getVenueTypeBadge(event.venue.type)}
              </div>
            </div>
          </div>
          <IconButton onClick={onClose}>
            <X className="w-5 h-5 text-foreground" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 4 }}
        dividers
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderColor: darkMode ? '#374151' : '#e5e7eb'
        }}
      >
        <div className="space-y-6">
          {/* Event Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Info className="w-5 h-5 mr-2 text-[#0077ED]" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <div className="text-gray-900 dark:text-white">
                  {event.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Type
                  </label>
                  <div className="flex items-center space-x-2">
                    {event.is_public ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                        Private
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Attendees
                  </label>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {event.max_attendees}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-[#0077ED]" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date & Time
                  </label>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {formatDateTime(event.startAt)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date & Time
                  </label>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {formatDateTime(event.endAt)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Deadline
                </label>
                <div className="text-gray-900 dark:text-white font-semibold">
                  {formatDateTime(event.registration_deadline)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Venue Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-[#0077ED]" />
                Venue Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Venue Type
                </label>
                <div>
                  {getVenueTypeBadge(event.venue.type)}
                </div>
              </div>

              {(event.venue.type === 'physical' || event.venue.type === 'hybrid') && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {event.venue.address}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {event.venue.city}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {event.venue.state}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {event.venue.country}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Postal Code
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {event.venue.postal_code}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(event.venue.type === 'virtual' || event.venue.type === 'hybrid') && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Platform
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {event.venue.platform}
                    </div>
                  </div>
                  {event.venue.virtual_link && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Virtual Link
                      </label>
                      <a
                        href={event.venue.virtual_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#0077ED] hover:text-[#0066CC] text-sm"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        {event.venue.virtual_link}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="w-5 h-5 mr-2 text-[#0077ED]" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Type
                  </label>
                  <div>
                    {event.isPaidEvent ? (
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Paid Event
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Free Event
                      </Badge>
                    )}
                  </div>
                </div>

                {event.isPaidEvent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ticket Price
                    </label>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(event.ticketPrice, event.currency)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Activity className="w-5 h-5 mr-2 text-[#0077ED]" />
                Event Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {event.max_attendees}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Max Attendees
                  </div>
                </div>
                
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {event.isPaidEvent ? formatCurrency(event.ticketPrice, event.currency) : 'Free'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ticket Price
                  </div>
                </div>

                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.ceil((new Date(event.endAt).getTime() - new Date(event.startAt).getTime()) / (1000 * 60 * 60))}h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Duration
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose} 
          className="px-6"
          style={{ 
            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
            color: darkMode ? '#ffffff' : '#000000'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailView;