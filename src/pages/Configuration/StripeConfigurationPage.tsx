import React, { useState } from 'react';
import ConfigurationSkeleton from '@/components/ui/skeleton/configuration-skeleton';
import {
  CreditCard,
  Save,
  Edit,
  Eye,
  EyeOff,
  DollarSign,
  Key,
  Shield,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StripeConfig {
  live_str_pub_key: string;
  live_str_private_key: string;
  sand_str_pub_key: string;
  sand_str_private_key: string;
  mode: string;
  supportedCurrencies: string[];
}

const StripeConfigurationPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showKeys, setShowKeys] = useState({
    live_pub: false,
    live_private: false,
    sand_pub: false,
    sand_private: false,
  });
  
  const [originalData] = useState<StripeConfig>({
    live_str_pub_key: "pk_live_51234567890abcdef",
    live_str_private_key: "sk_live_51234567890abcdef",
    sand_str_pub_key: "pk_test_51234567890abcdef",
    sand_str_private_key: "sk_test_51234567890abcdef",
    mode: "live",
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD"]
  });

  const [formData, setFormData] = useState<StripeConfig>(originalData);

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
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving Stripe configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleKeyVisibility = (keyType: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [keyType]: !prev[keyType] }));
  };

  const maskKey = (key: string, visible: boolean) => {
    if (visible) return key;
    return key.substring(0, 8) + '•'.repeat(key.length - 8);
  };

  const getModeColor = (mode: string) => {
    return mode === 'live' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Stripe Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your Stripe payment gateway settings and API keys
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Configuration
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

         {/* Security Notice */}
         <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Security Notice
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Keep your API keys secure and never share them publicly. Live keys should only be used in production environments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Mode Display */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#0077ED]/10 rounded-lg">
                <Shield className="w-5 h-5 text-[#0077ED]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Mode
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your Stripe integration is currently running in {formData.mode} mode
                </p>
              </div>
            </div>
            <Badge className={getModeColor(formData.mode)}>
              {formData.mode.toUpperCase()}
            </Badge>
          </div>
          
          {/* Mode Toggle */}
          {isEditing && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Switch Mode
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle between live and sandbox environments
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={cn(
                    "text-sm font-medium",
                    formData.mode === 'sandbox' ? 'text-[#0077ED]' : 'text-gray-500'
                  )}>
                    Sandbox
                  </span>
                  <Switch
                    checked={formData.mode === 'live'}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, mode: checked ? 'live' : 'sandbox' })
                    }
                    className="data-[state=checked]:bg-[#0077ED] data-[state=unchecked]:bg-yellow-500"
                  />
                  <span className={cn(
                    "text-sm font-medium",
                    formData.mode === 'live' ? 'text-[#0077ED]' : 'text-gray-500'
                  )}>
                    Live
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="w-5 h-5 mr-2 text-green-600" />
              Live Environment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Live Public Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live Public Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={isEditing ? formData.live_str_pub_key : maskKey(formData.live_str_pub_key, showKeys.live_pub)}
                  onChange={(e) => setFormData({ ...formData, live_str_pub_key: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 pr-12 font-mono text-sm"
                  placeholder="pk_live_..."
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('live_pub')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.live_pub ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Private Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live Private Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={isEditing ? formData.live_str_private_key : maskKey(formData.live_str_private_key, showKeys.live_private)}
                  onChange={(e) => setFormData({ ...formData, live_str_private_key: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 pr-12 font-mono text-sm"
                  placeholder="sk_live_..."
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('live_private')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.live_private ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sandbox Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="w-5 h-5 mr-2 text-yellow-600" />
              Sandbox Environment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sandbox Public Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sandbox Public Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={isEditing ? formData.sand_str_pub_key : maskKey(formData.sand_str_pub_key, showKeys.sand_pub)}
                  onChange={(e) => setFormData({ ...formData, sand_str_pub_key: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 pr-12 font-mono text-sm"
                  placeholder="pk_test_..."
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('sand_pub')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.sand_pub ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sandbox Private Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sandbox Private Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={isEditing ? formData.sand_str_private_key : maskKey(formData.sand_str_private_key, showKeys.sand_private)}
                  onChange={(e) => setFormData({ ...formData, sand_str_private_key: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 pr-12 font-mono text-sm"
                  placeholder="sk_test_..."
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('sand_private')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.sand_private ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supported Currencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="w-5 h-5 mr-2 text-[#0077ED]" />
            Supported Currencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {formData.supportedCurrencies.map((currency, index) => (
              <Badge
                key={index}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
              >
                {currency}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            These currencies are currently supported for payment processing
          </p>
        </CardContent>
      </Card>

   
    </div>
  );
};

export default StripeConfigurationPage;