/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  Camera,
  Mail,
  User,
  Calendar,
  Shield,
  Edit3,
  Crown,
  Sparkles,
  CheckCircle,
  Upload,
  Save,
  X,
  Lock,
  Loader2,
} from "lucide-react";
import ChangePasswordModal from "../components/ChangePasswordModal";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState(authUser?.fullName || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    if (authUser) {
      setNewFullName(authUser.fullName);
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too large. Maximum size is 2MB.");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
      setSelectedImg(null);
    };

    reader.onerror = () => {
      toast.error("Failed to read the image file.");
    };
  };

  const handleSaveFullName = async () => {
    if (!newFullName || newFullName.trim().length < 3) {
      return toast.error("Full name must be at least 3 characters");
    }

    if (newFullName.trim() === authUser?.fullName) {
      return setIsEditing(false);
    }

    setIsSavingName(true);
    try {
      await updateProfile({ fullName: newFullName.trim() });
      setIsEditing(false);
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error("Failed to update name. Please try again.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setNewFullName(authUser?.fullName);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveFullName();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="badge badge-primary badge-lg gap-2 mb-4">
            <Crown className="w-4 h-4" />
            Your Profile
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Profile Settings
            <span className="block text-xl font-normal text-base-content/70 mt-1">
              Manage your account information and preferences
            </span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Card */}
            <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 p-8">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative">
                    <div className="avatar">
                      <div className="w-32 h-32 rounded-full border-4 border-base-100 shadow-xl">
                        <img
                          src={
                            selectedImg || authUser?.profilePic || "/avatar.png"
                          }
                          alt="Profile"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className={`
                        absolute bottom-0 right-0 
                        btn btn-primary btn-circle
                        transition-all duration-300 hover:scale-110
                        ${
                          isUpdatingProfile
                            ? "animate-pulse pointer-events-none"
                            : ""
                        }
                      `}
                    >
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleImageUpload}
                        disabled={isUpdatingProfile}
                      />
                    </label>
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-base-content">
                    {authUser?.fullName}
                  </h2>
                  <p className="text-base-content/70 mt-1">
                    {isUpdatingProfile ? (
                      <span className="inline-flex items-center gap-2 text-primary">
                        <Upload className="w-4 h-4 animate-bounce" />
                        Updating profile...
                      </span>
                    ) : (
                      "Click the camera to update your photo"
                    )}
                  </p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-6">
                <div className="grid gap-6">
                  {/* Full Name Editing Section */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </span>
                    </label>
                    <div className="relative">
                      {isEditing ? (
                        <input
                          type="text"
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="input input-bordered input-primary w-full pr-16"
                          autoFocus
                          disabled={isSavingName}
                        />
                      ) : (
                        <div className="input input-bordered w-full bg-base-200">
                          {authUser?.fullName}
                        </div>
                      )}
                      <div className="absolute right-2 top-2 flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveFullName}
                              className="btn btn-ghost btn-sm text-success"
                              disabled={isSavingName}
                              aria-label="Save full name"
                            >
                              {isSavingName ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Save className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn btn-ghost btn-sm text-error"
                              disabled={isSavingName}
                              aria-label="Cancel editing"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-ghost btn-sm"
                            aria-label="Edit full name"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Press Enter to save or Escape to cancel
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Email Address Section */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </span>
                    </label>
                    <div className="relative">
                      <div className="input input-bordered w-full bg-base-200">
                        {authUser?.email}
                      </div>
                      <div className="absolute right-3 top-3 text-success flex items-center gap-1 text-sm">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-base-300">
                  <h3 className="text-lg font-semibold text-base-content mb-4">
                    Security
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="btn btn-primary"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-success to-success-content rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-success-content" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">
                    Account Status
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Your account is secure
                  </p>
                </div>
              </div>
              <div className="badge badge-success gap-2">
                <CheckCircle className="w-4 h-4" />
                Active
              </div>
            </div>

            {/* Account Information Card */}
            <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-primary-content" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">
                    Account Info
                  </h3>
                  <p className="text-sm text-base-content/70">Member details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-base-content/70" />
                    <span className="text-sm font-medium text-base-content">
                      Member Since
                    </span>
                  </div>
                  <span className="text-sm text-base-content font-semibold">
                    {authUser?.createdAt
                      ? new Date(authUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER THE MODAL */}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
