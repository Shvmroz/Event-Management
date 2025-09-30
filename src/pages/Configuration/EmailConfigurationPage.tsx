import React, { useState } from 'react';
import ConfigurationSkeleton from '@/components/ui/skeleton/configuration-skeleton';
import {
  Mail,
  Save,
  Edit,
  Eye,
  EyeOff,
  Key,
  User,
  Image,
  Link,
  Calendar,
  Globe,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/custom-button';

interface EmailConfig {
  mailcub_key: string;
  mailcub_url: string;
  from_email: string;
  from_name: string;
  logo: string;
  social_links: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  updated_at: string;
}

const EmailConfigurationPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [originalData] = useState<EmailConfig>({
    mailcub_key: "mc_live_1234567890abcdef",
    mailcub_url: "https://api.mailcub.com/v1",
    from_email: "noreply@platform.com",
    from_name: "Event Platform",
    logo: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    social_links: {
      facebook: "https://facebook.com/eventplatform",
      linkedin: "https://linkedin.com/company/eventplatform",
      instagram: "https://instagram.com/eventplatform",
      twitter: "https://twitter.com/eventplatform"
    },
    updated_at: "2025-08-20T09:45:12.000Z"
  });

  const [formData, setFormData] = useState<EmailConfig>(originalData);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ConfigurationSkeleton />;
  }

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the updated_at timestamp
      const updatedData = {
        ...formData,
        updated_at: new Date().toISOString()
      };
      
      setFormData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving email configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const maskApiKey = (key: string, visible: boolean) => {
    if (visible) return key;
    return key.substring(0, 8) + '•'.repeat(key.length - 8);
  };


  const updateSocialLink = (platform: string, url: string) => {
    setFormData({
      ...formData,
      social_links: {
        ...formData.social_links,
        [platform]: url
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your email service settings and branding
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              color="primary"
              variant="contained"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Configuration
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
                 color="primary"
              variant="contained"
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

      {/* Email Service Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Mail className="w-5 h-5 mr-2 text-[#0077ED]" />
            Email Service Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mailcub API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mailcub API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={isEditing ? formData.mailcub_key : maskApiKey(formData.mailcub_key, showApiKey)}
                  onChange={(e) => setFormData({ ...formData, mailcub_key: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 pr-12 font-mono text-sm"
                  placeholder="mc_live_..."
                />
                <span
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </span>
              </div>
            </div>

            {/* Mailcub URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mailcub URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="url"
                  value={formData.mailcub_url}
                  onChange={(e) => setFormData({ ...formData, mailcub_url: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="https://api.mailcub.com/v1"
                />
              </div>
            </div>

            {/* From Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  value={formData.from_email}
                  onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="noreply@platform.com"
                />
              </div>
            </div>

            {/* From Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={formData.from_name}
                  onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="Event Platform"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Logo URL
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                disabled={!isEditing}
                className="pl-10"
                placeholder="Enter logo URL"
              />
            </div>
            {formData.logo && (
              <div className="mt-3">
                <img
                  src={formData.logo}
                  alt="Email Logo"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>


        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Link className="w-5 h-5 mr-2 text-[#0077ED]" />
            Social Media Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook
              </label>
              <Input
                type="url"
                value={formData.social_links.facebook || ''}
                onChange={(e) => updateSocialLink('facebook', e.target.value)}
                disabled={!isEditing}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn
              </label>
              <Input
                type="url"
                value={formData.social_links.linkedin || ''}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                disabled={!isEditing}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instagram
              </label>
              <Input
                type="url"
                value={formData.social_links.instagram || ''}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                disabled={!isEditing}
                placeholder="https://instagram.com/yourpage"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter
              </label>
              <Input
                type="url"
                value={formData.social_links.twitter || ''}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                disabled={!isEditing}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfigurationPage;