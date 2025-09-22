"use client";

import React, { useState } from "react";
import { Lock, Save, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { _change_password_api } from "@/DAL/authAPI";
import Spinner from "../../components/ui/spinner";

const ChangePasswordPageClient: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async () => {
    setLoading(true);
    const req_data = {
      current_password: passwords.oldPassword,
      new_password: passwords.confirmPassword,
    };
    const result = await _change_password_api(req_data);
    if (result?.code === 200) {
      enqueueSnackbar(result?.message, { variant: "success" });
      router.push("/dashboard");
    } else {
      enqueueSnackbar(result?.message || "Password change failed", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  // Validation flags
  const minLength = 5;
  const oldPassValid = passwords.oldPassword.length >= minLength;
  const newPassValid = passwords.newPassword.length >= minLength;
  const confirmPassValid = passwords.confirmPassword.length >= minLength;
  const passwordsMatch = passwords.newPassword === passwords.confirmPassword;

  // Button is enabled only if all fields valid and passwords match
  const isFormValid =
    oldPassValid && newPassValid && confirmPassValid && passwordsMatch;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Change Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your account password for better security
          </p>
        </div>
      </div>

      {/* Change Password Form */}
      <form
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        onSubmit={(e) => {
          e.preventDefault();
          handlePasswordChange();
        }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Password Security
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose a strong password to keep your account secure
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showOldPassword ? "text" : "password"}
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, oldPassword: e.target.value })
                }
                placeholder="Enter current password"
                required
                className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  passwords.oldPassword.length > 0 && !oldPassValid
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOldPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwords.oldPassword.length > 0 && !oldPassValid && (
              <p className="text-red-600 text-[12px] mt-1 ms-1">
                Password must be at least 5 characters
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                placeholder="Enter new password"
                required
                className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  passwords.newPassword.length > 0 && !newPassValid
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwords.newPassword.length > 0 && !newPassValid && (
              <p className="text-red-600 text-[12px] mt-1 ms-1">
                Password must be at least 5 characters
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Confirm new password"
                required
                className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  passwords.confirmPassword.length > 0 && !confirmPassValid
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {!passwordsMatch && passwords.confirmPassword.length > 0 && (
              <p className="text-red-600 text-[12px] mt-1 ms-1">
                Passwords do not match
              </p>
            )}
            {passwords.confirmPassword.length > 0 && !confirmPassValid && (
              <p className="text-red-600 text-[12px] mt-0.5 ms-1">
                Password must be at least 5 characters
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Spinner size="sm" className="text-white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPageClient;
