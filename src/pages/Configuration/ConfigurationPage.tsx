import React, { useState } from "react";
import ConfigurationSkeleton from "@/components/ui/skeleton/configuration-skeleton";
import { Settings, Save, Edit, Globe, Mail, Clock, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/ui/searchable-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/custom-button";

interface GeneralSettings {
  site_name: string;
  site_logo: string;
  contact_email: string;
  // admin_settings: object;
  time_zone: string;
  updated_at: string;
}

const ConfigurationPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [originalData] = useState<GeneralSettings>({
    site_name: "Event Management Platform",
    site_logo:
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    contact_email: "support@platform.com",
    // admin_settings: {},
    time_zone: "Europe/Dublin",
    updated_at: "2025-08-20T09:45:12.000Z",
  });

  const [formData, setFormData] = useState<GeneralSettings>(originalData);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ConfigurationSkeleton />;
  }

  const timeZones = [
    "Europe/Dublin",
    "Europe/London",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Tokyo",
    "Australia/Sydney",
    "UTC",
  ];

  // Convert to SearchableSelect format
  const timeZoneOptions = timeZones.map((tz) => ({
    value: tz,
    label: tz,
  }));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the updated_at timestamp
      const updatedData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      setFormData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving configuration:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            General Configurations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your platform's basic settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <Button onClick={handleEdit} variant="contained" color="primary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Settings
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="contained"
                color="primary"
              >
                {isSaving ? (
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
            </div>
          )}
        </div>
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Settings className="w-5 h-5 mr-2 text-orange-500" />
            Platform Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={formData.site_name}
                  onChange={(e) =>
                    setFormData({ ...formData, site_name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="Enter site name"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="Enter contact email"
                />
              </div>
            </div>

            {/* Site Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Logo URL
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="url"
                  value={formData.site_logo}
                  onChange={(e) =>
                    setFormData({ ...formData, site_logo: e.target.value })
                  }
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="Enter logo URL"
                />
              </div>
              {formData.site_logo && (
                <div className="mt-3">
                  <img
                    src={formData.site_logo}
                    alt="Site Logo"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Time Zone
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <SearchableSelect
                  options={timeZoneOptions}
                  value={formData.time_zone}
                  onChange={(value) =>
                    setFormData({ ...formData, time_zone: value })
                  }
                  disabled={!isEditing}
                  placeholder="Select time zone"
                  className="pl-10"
                  search={true}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationPage;
