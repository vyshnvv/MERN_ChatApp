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
import ChangePasswordModal from "../components/ChangePasswordModal"; // Ensure this component is created and imported

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  // State for editing full name
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState(authUser?.fullName || "");

  // State for password modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect to update local state if authUser changes
  useEffect(() => {
    if (authUser) {
      setNewFullName(authUser.fullName);
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: Add a file size check
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      return toast.error("File is too large. Maximum size is 2MB.");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image); // Show preview immediately
      await updateProfile({ profilePic: base64Image });
      setSelectedImg(null); // Clear preview after successful upload
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
      return setIsEditing(false); // No changes were made
    }
    await updateProfile({ fullName: newFullName.trim() });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNewFullName(authUser?.fullName);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-sm font-medium text-purple-700 shadow-sm mb-4">
            <Crown className="w-4 h-4" />
            Your Profile
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Profile Settings
            <span className="block text-xl font-normal text-gray-600 mt-1">
              Manage your account information and preferences
            </span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative">
                    <img
                      src={selectedImg || authUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className={`
                        absolute bottom-0 right-0 
                        bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600
                        p-3 rounded-full cursor-pointer shadow-lg
                        transition-all duration-300 hover:scale-110 hover:shadow-xl
                        ${
                          isUpdatingProfile
                            ? "animate-pulse pointer-events-none"
                            : ""
                        }
                      `}
                    >
                      <Camera className="w-5 h-5 text-white" />
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
                  <h2 className="text-2xl font-bold text-gray-900">
                    {authUser?.fullName}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {isUpdatingProfile ? (
                      <span className="inline-flex items-center gap-2 text-purple-600">
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
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="relative">
                      {isEditing ? (
                        <input
                          type="text"
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          className="w-full px-4 py-4 bg-white border-2 border-purple-400 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                          autoFocus
                        />
                      ) : (
                        <div className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium">
                          {authUser?.fullName}
                        </div>
                      )}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveFullName}
                              className="text-green-500 hover:text-green-700 disabled:text-gray-400 transition-colors"
                              disabled={isUpdatingProfile}
                              aria-label="Save full name"
                            >
                              {isUpdatingProfile ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Save className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              aria-label="Cancel editing"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                            aria-label="Edit full name"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email Address Section */}
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium">
                        {authUser?.email}
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 flex items-center gap-1 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Security
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
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
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Account Status
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your account is secure
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Active
              </div>
            </div>

            {/* Account Information Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Account Info</h3>
                  <p className="text-sm text-gray-600">Member details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Member Since
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 font-semibold">
                    {new Date(authUser.createdAt).toLocaleDateString()}
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
