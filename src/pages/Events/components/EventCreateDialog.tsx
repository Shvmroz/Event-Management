'use client';

import React, { useState } from 'react';
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
import { Save, X, Calendar } from 'lucide-react';

interface EventCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: any) => void;
  loading?: boolean;
}

const EventCreateDialog: React.FC<EventCreateDialogProps> = ({
  open,
  onOpenChange,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent = {
      _id: `event_${Date.now()}`,
      ...formData,
      created_at: new Date().toISOString(),
    };

    onSave(newEvent);
    
    // Reset form
    setFormData({
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
          maxHeight: '90vh',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle>
        <div className="flex items-center" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
          <Calendar className="w-5 h-5 mr-2 text-[#0077ED]" />
          Create Event
        </div>
      </DialogTitle>

      <DialogContent 
        sx={{ paddingTop: 2, paddingBottom: 2, overflow: 'auto' }}
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6" id="event-create-form">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title *
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
                Description *
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
                  Start Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.startAt.slice(0, 16)}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value + ':00.000Z' })}
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
                  End Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.endAt.slice(0, 16)}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value + ':00.000Z' })}
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
                Registration Deadline *
              </label>
              <Input
                type="datetime-local"
                value={formData.registration_deadline.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value + ':00.000Z' })}
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
                Venue Type *
              </label>
              <Select
                value={formData.venue.type}
                onValueChange={(value) => updateVenue('type', value)}
                required
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
                  Status *
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  required
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
                  Max Attendees *
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
                  id="isPaidEvent"
                  checked={formData.isPaidEvent}
                  onChange={(e) => setFormData({ ...formData, isPaidEvent: e.target.checked })}
                  className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isPaidEvent" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paid Event
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="is_public" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
          form="event-create-form"
          type="submit"
          disabled={loading || !formData.title || !formData.description}
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white dark:text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              Creating...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Event
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventCreateDialog;