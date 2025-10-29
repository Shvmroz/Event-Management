import React, { Suspense, useState } from "react";
import SettingsSkeleton from "@/components/ui/skeleton/settings-skeleton";
import {  Save, Edit, FileText, Scale } from "lucide-react";
import QuillEditor from "@/components/ui/quillEditor/quillEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/custom-button";

interface LegalSettings {
  privacy_policy: string;
  terms_conditions: string;
  updated_at: string;
}

const SettingsPage: React.FC = () => {
  const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [isSavingTerms, setIsSavingTerms] = useState(false);
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

  const handleEditPrivacy = () => {
    setIsEditingPrivacy(true);
  };

  const handleEditTerms = () => {
    setIsEditingTerms(true);
  };

  const handleCancelPrivacy = () => {
    setFormData(originalData);
    setIsEditingPrivacy(false);
  };

  const handleCancelTerms = () => {
    setFormData(originalData);
    setIsEditingTerms(false);
  };

  const handleSavePrivacy = async () => {
    setIsSavingPrivacy(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the updated_at timestamp
      const updatedData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      setFormData(updatedData);
      setIsEditingPrivacy(false);
    } catch (error) {
      console.error("Error saving privacy policy:", error);
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const handleSaveTerms = async () => {
    setIsSavingTerms(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the updated_at timestamp
      const updatedData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      setFormData(updatedData);
      setIsEditingTerms(false);
    } catch (error) {
      console.error("Error saving terms & conditions:", error);
    } finally {
      setIsSavingTerms(false);
    }
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
      </div>

      {/* Privacy Policy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="w-5 h-5 mr-2 text-orange-500" />
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Privacy Policy Content
              </label>
              <QuillEditor
                value={formData.privacy_policy}
                onChange={(value) =>
                  setFormData({ ...formData, privacy_policy: value })
                }
                placeholder="Enter your privacy policy content..."
                disabled={!isEditingPrivacy}
                rows={16}
              />
            </div>

            {/* Privacy Policy Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!isEditingPrivacy ? (
                <Button
                  onClick={handleEditPrivacy}
                  variant="contained"
                  color="primary"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Privacy Policy
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outlined"
                    onClick={handleCancelPrivacy}
                    disabled={isSavingPrivacy}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePrivacy}
                    disabled={isSavingPrivacy}
                    variant="contained"
                  color="primary"
                  >
                    {isSavingPrivacy ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Privacy Policy
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Scale className="w-5 h-5 mr-2 text-orange-500" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Terms & Conditions Content
              </label>
              <QuillEditor
                value={formData.terms_conditions}
                onChange={(value) =>
                  setFormData({ ...formData, terms_conditions: value })
                }
                placeholder="Enter your terms & conditions content..."
                disabled={!isEditingTerms}
                rows={16}
              />
            </div>

            {/* Terms & Conditions Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!isEditingTerms ? (
                <Button
                  onClick={handleEditTerms}
                   variant="contained"
                  color="primary"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Terms & Conditions
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outlined"
                    onClick={handleCancelTerms}
                    disabled={isSavingTerms}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTerms}
                    disabled={isSavingTerms}
                     variant="contained"
                  color="primary"
                  >
                    {isSavingTerms ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Terms & Conditions
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default SettingsPage;
