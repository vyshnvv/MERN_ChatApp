import { useState, useMemo, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
  Sparkles,
  Shield,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarStyle, setAvatarStyle] = useState("identicon");
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const debounceTimer = useRef(null);

  const { signUp, isSigningUp } = useAuthStore();

  const avatarStyles = useMemo(
    () => ["identicon", "bottts", "avataaars", "micah", "open-peeps"],
    []
  );

  // Generate avatar preview with debounce
  useEffect(() => {
    if (!formData.fullName.trim()) {
      setAvatarPreview("");
      return;
    }

    setIsGeneratingAvatar(true);

    // Clear any existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      const seed = encodeURIComponent(
        formData.fullName.trim().toLowerCase() +
          Math.random().toString(36).substring(2, 10)
      );

      setAvatarPreview(
        `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}`
      );
      setIsGeneratingAvatar(false);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData.fullName, avatarStyle]);

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password &&
      formData.password.length >= 6
    );
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      // Generate final avatar URL
      const seed = encodeURIComponent(
        formData.fullName.trim().toLowerCase() +
          Math.random().toString(36).substring(2, 10)
      );
      const profilePic = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}`;

      signUp({
        ...formData,
        profilePic,
      });
    }
  };

  const cycleAvatarStyle = () => {
    const currentIndex = avatarStyles.indexOf(avatarStyle);
    const nextIndex = (currentIndex + 1) % avatarStyles.length;
    setAvatarStyle(avatarStyles[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left side - Hero Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-sm font-medium text-purple-700 shadow-sm">
                <Sparkles className="w-4 h-4" />
                Join thousands of users
              </div>

              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Welcome to the
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Future of Chat
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with friends, share moments, and build communities in a
                whole new way. Experience messaging that's fast, secure, and
                beautifully designed.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    End-to-End Security
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your conversations are protected with military-grade
                    encryption
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Global Community
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Connect with people from around the world instantly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8">
                {/* Logo */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-xl">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Create Account
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Start your journey with us today
                    </p>
                  </div>
                </div>

                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16" />
                      )}

                      {isGeneratingAvatar && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <button
                        type="button"
                        onClick={cycleAvatarStyle}
                        className="px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-700 shadow-md hover:shadow-lg transition-shadow flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Change Style
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-700">
                      Your unique avatar
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {avatarStyles.findIndex((s) => s === avatarStyle) + 1} of{" "}
                      {avatarStyles.length} styles
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 placeholder-gray-500"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 placeholder-gray-500"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-4 pr-12 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 placeholder-gray-500"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                    disabled={isSigningUp || !isFormValid}
                  >
                    {isSigningUp ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Your Account...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-200/50">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Mobile Hero Content */}
              <div className="lg:hidden mt-8 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-purple-700 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  Join thousands of users
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Welcome to the
                  <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Future of Chat
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
