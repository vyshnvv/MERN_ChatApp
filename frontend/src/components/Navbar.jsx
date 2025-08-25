import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { MessageSquare, User, LogOut, Bell, Search } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  // Don't show navbar on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  // If user is not authenticated, don't show navbar
  if (!authUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-base-100 border-b border-base-300 shadow-md h-16">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-center w-full">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <MessageSquare className="w-5 h-5 text-primary-content" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ChatApp
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 input input-bordered rounded-full bg-base-200 border-base-300"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="btn btn-ghost btn-circle">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost flex items-center gap-2"
              >
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary">
                    {authUser.profilePic ? (
                      <img
                        src={authUser.profilePic}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary-content" />
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-base-content hidden md:block">
                  {authUser.fullName?.split(" ")[0]}
                </span>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2 z-50 border border-base-300"
              >
                <li className="border-b border-base-300 p-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary">
                        {authUser.profilePic ? (
                          <img
                            src={authUser.profilePic}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-primary-content" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-base-content">
                        {authUser.fullName}
                      </p>
                      <p className="text-sm text-base-content/70">
                        {authUser.email}
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-base-content hover:bg-base-200"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-error hover:bg-base-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
