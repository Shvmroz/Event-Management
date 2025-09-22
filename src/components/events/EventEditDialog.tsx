'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X } from 'lucide-react';

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
}

interface EventEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onSave: (event: any) => void;
  loading?: boolean;
}

const EventEditDialog: React.FC<EventEditDialogProps> = ({
  open,
  onOpenChange,
  event,
  onSave,
  loading = false,
}) => {
  const { darkMode } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    venue: {
      type: 'physical',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      virtual_link: '',
      platform: '',
    },
    status: 'draft',
    ticketPrice: 0,
    currency: 'USD',
    isPaidEvent: false,
    max_attendees: 100,
    registration_deadline: '',
    is_public: true,
  });

  const venueTypes = ['physical', 'virtual', 'hybrid'];
  const statuses = ['draft', 'published', 'cancelled', 'completed'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD'];
  const platforms = ['Zoom', 'Google Meet', 'Microsoft Teams', 'WebEx', 'Other'];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startAt: event.startAt.slice(0, 16),
        endAt: event.endAt.slice(0, 16),
        venue: event.venue,
        status: event.status,
        ticketPrice: event.ticketPrice,
        currency: event.currency,
        isPaidEvent: event.isPaidEvent,
        max_attendees: event.max_attendees,
        registration_deadline: event.registration_deadline.slice(0, 16),
        is_public: event.is_public,
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      const updatedEvent: Event = {
        ...event,
        title: formData.title,
        description: formData.description,
        startAt: formData.startAt + ':00.000Z',
        endAt: formData.endAt + ':00.000Z',
        venue: formData.venue,
        status: formData.status,
        ticketPrice: formData.ticketPrice,
        currency: formData.currency,
        isPaidEvent: formData.isPaidEvent,
        max_attendees: formData.max_attendees,
        registration_deadline: formData.registration_deadline + ':00.000Z',
        is_public: formData.is_public,
      };
      onSave(updatedEvent);
    }
  };

  const updateVenue = (field: string, value: string) => {
    setFormData({
      ...formData,
      venue: {
        ...formData.venue,
        [field]: value,
      },
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderRadius: '12px',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle style={{ color: darkMode ? '#ffffff' : '#000000' }}>
        Edit Event
      </DialogTitle>

      <DialogContent 
        sx={{ paddingTop: 2, paddingBottom: 2, overflow: 'auto' }}
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6" id="event-edit-form">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={4}
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    borderColor: darkMode ? '#4b5563' : '#d1d5db'
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    borderColor: darkMode ? '#4b5563' : '#d1d5db'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration Deadline
              </label>
              <Input
                type="datetime-local"
                value={formData.registration_deadline}
                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
              />
            </div>
          </div>

          {/* Venue Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Venue Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Venue Type
              </label>
              <Select
                value={formData.venue.type}
                onValueChange={(value) => updateVenue('type', value)}
              >
                <SelectTrigger
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    borderColor: darkMode ? '#4b5563' : '#d1d5db'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    borderColor: darkMode ? '#4b5563' : '#d1d5db'
                  }}
                >
                  {venueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(formData.venue.type === 'physical' || formData.venue.type === 'hybrid') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <Input
                    value={formData.venue.address}
                    onChange={(e) => updateVenue('address', e.target.value)}
                    placeholder="Enter address"
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <Input
                    value={formData.venue.city}
                    onChange={(e) => updateVenue('city', e.target.value)}
                    placeholder="Enter city"
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <Input
                    value={formData.venue.state}
                    onChange={(e) => updateVenue('state', e.target.value)}
                    placeholder="Enter state"
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <Input
                    value={formData.venue.country}
                    onChange={(e) => updateVenue('country', e.target.value)}
                    placeholder="Enter country"
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <Input
                    value={formData.venue.postal_code}
                    onChange={(e) => updateVenue('postal_code', e.target.value)}
                    placeholder="Enter postal code"
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  />
                </div>
              </div>
            )}

            {(formData.venue.type === 'virtual' || formData.venue.type === 'hybrid') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Virtual Link
                  </label>
                  <Input
                    type="url"
                    value={formData.venue.virtual_link}
                    onChange={(e) => updateVenue('virtual_link', e.target.value)}
                    placeholder="https://zoom.us/j/1234567890"
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform
                  </label>
                  <Select
                    value={formData.venue.platform}
                    onValueChange={(value) => updateVenue('platform', value)}
                  >
                    <SelectTrigger
                      style={{
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                        borderColor: darkMode ? '#4b5563' : '#d1d5db'
                      }}
                    >
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                        borderColor: darkMode ? '#4b5563' : '#d1d5db'
                      }}
                    >
                      {platforms.map(platform => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Event Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  >
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Attendees
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.max_attendees}
                  onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) || 0 })}
                  placeholder="100"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    borderColor: darkMode ? '#4b5563' : '#d1d5db'
                  }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ticket Price
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    borderColor: darkMode ? '#4b5563' : '#d1d5db'
                  }}
                  disabled={!formData.isPaidEvent}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  disabled={!formData.isPaidEvent}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderColor: darkMode ? '#4b5563' : '#d1d5db'
                    }}
                  >
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_isPaidEvent"
                  checked={formData.isPaidEvent}
                  onChange={(e) => setFormData({ ...formData, isPaidEvent: e.target.checked })}
                  className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="edit_isPaidEvent" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paid Event
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="edit_is_public" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Public Event
                </label>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}` }}>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
          style={{
            backgroundColor: darkMode ? '#374151' : '#f9fafb',
            color: darkMode ? '#f3f4f6' : '#374151',
            borderColor: darkMode ? '#4b5563' : '#d1d5db'
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          form="event-edit-form"
          type="submit"
          disabled={loading}
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white dark:text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventEditDialog;