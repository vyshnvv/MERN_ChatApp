import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  User,
  Calendar,
  Shield,
  Edit3,
  Settings,
  Crown,
  Sparkles,
  CheckCircle,
  Upload,
} from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
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
            Profile
            <span className="block text-xl font-normal text-gray-600 mt-1">
              Manage your account information
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
                        accept="image/*"
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
                      <span className="inline-flex items-center gap-2">
                        <Upload className="w-4 h-4 animate-bounce" />
                        Uploading photo...
                      </span>
                    ) : (
                      "Click the camera icon to update your photo"
                    )}
                  </p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-6">
                <div className="grid gap-6">
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium">
                        {authUser?.fullName}
                      </div>
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium">
                        {authUser?.email}
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 hover:scale-105">
                      <Settings className="w-4 h-4" />
                      Settings
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
                    {authUser.createdAt?.split("T")[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Verification
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-green-600 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Features Card */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl shadow-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Premium Features</h3>
                  <p className="text-sm text-white/80">
                    Unlock more capabilities
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  Unlimited file sharing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  Advanced security
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  Priority support
                </li>
              </ul>
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl font-semibold transition-all duration-300 hover:scale-105">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
