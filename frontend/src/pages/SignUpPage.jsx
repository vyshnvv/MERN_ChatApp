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
    <div className="min-h-screen bg-base-200 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

        {/* Additional subtle orbs for depth */}
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-lg animate-pulse delay-2000"></div>
        <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-md animate-pulse delay-3000"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-base-content/30 rounded-full animate-float-${
                i % 3
              }`}
              style={{
                left: `${25 + i * 20}%`,
                top: `${30 + ((i * 15) % 30)}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${10 + i * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left side - Hero Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary shadow-sm">
                <Sparkles className="w-4 h-4" />
                Join thousands of users
              </div>

              <h1 className="text-5xl font-bold text-base-content leading-tight">
                Welcome to the
                <span className="block text-primary">Future of Chat</span>
              </h1>

              <p className="text-xl text-base-content/70 leading-relaxed">
                Connect with friends, share moments, and build communities in a
                whole new way. Experience messaging that's fast, secure, and
                beautifully designed.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start gap-4 p-6 bg-base-100/60 backdrop-blur-sm rounded-2xl border border-base-300 shadow-lg">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-primary-content" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content mb-1">
                    End-to-End Security
                  </h3>
                  <p className="text-base-content/70 text-sm">
                    Your conversations are protected with military-grade
                    encryption
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-base-100/60 backdrop-blur-sm rounded-2xl border border-base-300 shadow-lg">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-secondary-content" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content mb-1">
                    Global Community
                  </h3>
                  <p className="text-base-content/70 text-sm">
                    Connect with people from around the world instantly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-base-300 p-8 space-y-8">
                {/* Logo */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl">
                    <MessageSquare className="w-8 h-8 text-primary-content" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-content">
                      Create Account
                    </h2>
                    <p className="text-base-content/70 mt-2">
                      Start your journey with us today
                    </p>
                  </div>
                </div>

                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-base-100 shadow-xl">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-base-300 border-2 border-dashed rounded-full w-16 h-16" />
                      )}

                      {isGeneratingAvatar && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <button
                        type="button"
                        onClick={cycleAvatarStyle}
                        className="px-3 py-1 bg-base-100 rounded-full text-xs font-medium text-primary shadow-md hover:shadow-lg transition-shadow flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Change Style
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-medium text-base-content">
                      Your unique avatar
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      {avatarStyles.findIndex((s) => s === avatarStyle) + 1} of{" "}
                      {avatarStyles.length} styles
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-base-content flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        className="w-full px-4 py-4 bg-base-200 border-2 border-base-300 rounded-2xl focus:border-primary focus:bg-base-100 transition-all duration-300 outline-none text-base-content placeholder-base-content/50"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-base-content flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        className="w-full px-4 py-4 bg-base-200 border-2 border-base-300 rounded-2xl focus:border-primary focus:bg-base-100 transition-all duration-300 outline-none text-base-content placeholder-base-content/50"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-base-content flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-4 pr-12 bg-base-200 border-2 border-base-300 rounded-2xl focus:border-primary focus:bg-base-100 transition-all duration-300 outline-none text-base-content placeholder-base-content/50"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
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

                <div className="text-center pt-4 border-t border-base-300/50">
                  <p className="text-base-content/70">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-primary hover:text-primary-focus transition-all duration-300"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Mobile Hero Content */}
              <div className="lg:hidden mt-8 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-base-100/60 backdrop-blur-sm rounded-full text-sm font-medium text-primary shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  Join thousands of users
                </div>
                <h3 className="text-2xl font-bold text-base-content">
                  Welcome to the
                  <span className="block text-primary">Future of Chat</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float-0 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(180deg);
          }
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(6px) rotate(-180deg);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(90deg);
          }
        }
        .animate-float-0 {
          animation: float-0 12s ease-in-out infinite;
        }
        .animate-float-1 {
          animation: float-1 14s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 16s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;
