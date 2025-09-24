"use client";

import React, { lazy, Suspense, useState } from "react";
import SettingsSkeleton from "@/components/ui/skeleton/settings-skeleton";
import { Shield, Save, Edit, FileText, Scale, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
const QuillEditor = lazy(
  () => import("@/components/ui/quillEditor/quillEditor")
);
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LegalSettings {
  privacy_policy: string;
  terms_conditions: string;
  updated_at: string;
}

const SettingsPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("privacy");
  const [loading, setLoading] = useState(true);

  const [originalData] = useState<LegalSettings>({
    privacy_policy: `
      <h2>Privacy Policy</h2>
      <p><strong>Last updated:</strong> August 20, 2025</p>
      
      <h3>1. Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you create an account, register for events, or contact us for support.</p>
      
      <h3>2. How We Use Your Information</h3>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send you technical notices and support messages</li>
        <li>Communicate with you about events, offers, and promotions</li>
      </ul>
      
      <h3>3. Information Sharing</h3>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
      
      <h3>4. Data Security</h3>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      
      <h3>5. Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@platform.com</p>
    `,
    terms_conditions: `
      <h2>Terms and Conditions</h2>
      <p><strong>Last updated:</strong> August 20, 2025</p>
      
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h3>2. Use License</h3>
      <p>Permission is granted to temporarily use this platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
      <ul>
        <li>Modify or copy the materials</li>
        <li>Use the materials for any commercial purpose or for any public display</li>
        <li>Attempt to reverse engineer any software contained on the platform</li>
        <li>Remove any copyright or other proprietary notations from the materials</li>
      </ul>
      
      <h3>3. Event Registration</h3>
      <p>When you register for events through our platform:</p>
      <ul>
        <li>You agree to provide accurate and complete information</li>
        <li>You are responsible for all fees associated with your registration</li>
        <li>Cancellation policies vary by event and are set by event organizers</li>
      </ul>
      
      <h3>4. Payment Terms</h3>
      <p>All payments are processed securely through our payment partners. Refund policies are determined by individual event organizers.</p>
      
      <h3>5. Limitation of Liability</h3>
      <p>In no event shall the platform or its suppliers be liable for any damages arising out of the use or inability to use the platform.</p>
      
      <h3>6. Contact Information</h3>
      <p>For questions regarding these terms, please contact us at legal@platform.com</p>
    `,
    updated_at: "2025-08-20T09:45:12.000Z",
  });

  const [formData, setFormData] = useState<LegalSettings>(originalData);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SettingsSkeleton />;
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the updated_at timestamp
      const updatedData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      setFormData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving legal settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your privacy policy and terms & conditions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Settings
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
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

      {/* Legal Documents Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Shield className="w-5 h-5 mr-2 text-[#0077ED]" />
            Legal Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="privacy"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Privacy Policy</span>
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="flex items-center space-x-2"
              >
                <Scale className="w-4 h-4" />
                <span>Terms & Conditions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="privacy" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Privacy Policy Content
                </label>
                <Suspense fallback={<div>Loading editor...</div>}>
                  <QuillEditor
                    value={formData.privacy_policy}
                    onChange={(value) =>
                      setFormData({ ...formData, privacy_policy: value })
                    }
                    placeholder="Enter your privacy policy content..."
                    disabled={!isEditing}
                    rows={16}
                  />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="terms" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Terms & Conditions Content
                </label>
                <Suspense fallback={<div>Loading editor...</div>}>
                  <QuillEditor
                    value={formData.terms_conditions}
                    onChange={(value) =>
                      setFormData({ ...formData, terms_conditions: value })
                    }
                    placeholder="Enter your terms & conditions content..."
                    disabled={!isEditing}
                    rows={16}
                  />
                </Suspense>
              </div>
            </TabsContent>
          </Tabs>

          {/* Last Updated Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {formatDate(formData.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
