
import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Save, Pencil, Image as ImageIcon, Trash } from "lucide-react";
import { _update_admin_profile_api } from "@/DAL/authAPI";
import { useSnackbar } from "notistack";
import Spinner from "../../components/ui/spinner";
import { Input } from "@/components/ui/input";
import { s3baseUrl } from "@/config/config";
import { deleteFileFunction, uploadFileFunction } from "@/utils/fileUploadRemoveFunctions";
import { useAppContext } from "@/contexts/AppContext";

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    image: user?.profile_image || "",
    previewImage: null as File | null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        image: user.profile_image || "",
        previewImage: null,
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      enqueueSnackbar("Image must be less than or equal to 1MB", { variant: "warning" });
      return;
    }

    setProfile((prev) => ({ ...prev, previewImage: file }));
  };

  const handleRemoveImage = () => {
    setProfile((prev) => ({ ...prev, image: "", previewImage: null }));
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
  };

  const handleCancel = () => {
    setProfile({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      image: user?.profile_image || "",
      previewImage: null,
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    let uploaded_image = profile.image;

    if (profile.previewImage) {
      if (user?.profile_image) {
        const deleted = await deleteFileFunction(user.profile_image);
        if (!deleted) {
          enqueueSnackbar("Failed to delete old image", { variant: "error" });
          setLoading(false);
          return;
        }
      }
      uploaded_image = await uploadFileFunction(profile.previewImage);
    }

    const req_data = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      profile_image: uploaded_image || "",
    };

    const result = await _update_admin_profile_api(req_data);

    if (result?.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });

      // Update profile state
      setProfile({
        first_name: result.admin.first_name || "",
        last_name: result.admin.last_name || "",
        email: result.admin.email || profile.email,
        image: result.admin.profile_image || "",
        previewImage: null,
      });

      // Update context
      setUser((prev) => ({
        ...prev!,
        first_name: result.admin.first_name || "",
        last_name: result.admin.last_name || "",
        profile_image: result.admin.profile_image || "",
      }));

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
      storedUser.first_name = result.admin.first_name || storedUser.first_name;
      storedUser.last_name = result.admin.last_name || storedUser.last_name;
      storedUser.profile_image = result.admin.profile_image || storedUser.profile_image;
      localStorage.setItem("userData", JSON.stringify(storedUser));

      setIsEditing(false);
    } else {
      enqueueSnackbar(result?.message || "Failed to update profile", { variant: "error" });
    }

    setLoading(false);
  };

  const isFormChanged =
    profile.first_name !== user?.first_name ||
    profile.last_name !== user?.last_name ||
    profile.previewImage !== null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your personal information and profile details
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Image */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-full aspect-square">
              <label className={`w-full h-full cursor-pointer ${!isEditing ? "pointer-events-none" : ""}`}>
                <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {profile.previewImage ? (
                    <img src={URL.createObjectURL(profile.previewImage)} alt="Preview" className="w-full h-full object-cover" />
                  ) : profile.image ? (
                    <img src={s3baseUrl + profile.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-xs">No Photo</span>
                    </div>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={!isEditing} />
              </label>

              {(profile.previewImage || profile.image) && isEditing && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md text-red-500 hover:text-red-600 transition"
                >
                  <Trash className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-2 text-center">Recommended: 1:1 Ratio up to 1MB</p>
          </div>

          {/* Form */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <Input
                    type="text"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 ${
                      isEditing ? "" : "opacity-70 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4  text-gray-600 dark:text-gray-300" />
                  <Input
                    type="text"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 ${
                      isEditing ? "" : "opacity-70 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4  text-gray-600 dark:text-gray-300" />
                  <Input type="email" value={profile.email} disabled className="w-full pl-10 pr-4 py-3 opacity-70 cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors">
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <>
                  <button type="button" onClick={handleCancel} className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    disabled={loading || !isFormChanged}
                  >
                    {loading && <Spinner size="sm" className="text-white" />}
                    <span>Save</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
