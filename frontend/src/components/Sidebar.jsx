import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import {
  Users,
  Search,
  Filter,
  MessageCircle,
  UserPlus,
  Settings,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesOnlineFilter = showOnlineOnly
      ? onlineUsers.includes(user._id)
      : true;
    return matchesSearch && matchesOnlineFilter;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl flex flex-col transition-all duration-300">
      {/* Header Section */}
      <div className="p-6 border-b border-white/20 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
            <p className="text-sm text-gray-600">Stay connected with friends</p>
          </div>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden lg:block mb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-xl focus:border-purple-400 focus:bg-white transition-all duration-300 outline-none text-gray-700 placeholder-gray-500"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-3 group">
            <div className="relative">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-all duration-300 ${
                  showOnlineOnly
                    ? "bg-gradient-to-r from-purple-500 to-blue-500"
                    : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 transform top-1 absolute ${
                    showOnlineOnly ? "translate-x-5" : "translate-x-1"
                  }`}
                ></div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
              Show online only
            </span>
          </label>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">
              {onlineUsers.length - 1} online
            </span>
          </div>
        </div>
      </div>



      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center text-sm">
              {searchTerm ? "No contacts found" : "No online users"}
            </p>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {filteredUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              const isSelected = selectedUser?._id === user._id;

              return (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`
                    w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 group
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                        : "hover:bg-white/60 text-gray-700 hover:shadow-md"
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full overflow-hidden shadow-md transition-all duration-300 ${
                        isSelected
                          ? "ring-2 ring-white/50"
                          : "group-hover:shadow-lg"
                      }`}
                    >
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm">
                        <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* User info - only visible on larger screens */}
                  <div className="hidden lg:flex flex-1 flex-col items-start min-w-0">
                    <div className="flex items-center gap-2 w-full">
                      <span
                        className={`font-semibold truncate ${
                          isSelected ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user.fullName}
                      </span>
                      {isOnline && (
                        <Sparkles
                          className={`w-3 h-3 ${
                            isSelected ? "text-white/80" : "text-green-500"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <span
                        className={`text-sm truncate ${
                          isSelected ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </span>
                      {isOnline && (
                        <div className="flex items-center gap-1">
                          <Clock
                            className={`w-3 h-3 ${
                              isSelected ? "text-white/60" : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              isSelected ? "text-white/60" : "text-gray-400"
                            }`}
                          >
                            Now
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message indicator - only visible on larger screens */}
                  <div className="hidden lg:block">
                    <MessageCircle
                      className={`w-4 h-4 ${
                        isSelected
                          ? "text-white/80"
                          : "text-gray-400 group-hover:text-purple-500"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats - Hidden on mobile */}
      <div className="hidden lg:block p-4 border-t border-white/20 bg-gradient-to-r from-gray-50/50 to-purple-50/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">
              {filteredUsers.length} contacts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">
              {onlineUsers.length - 1} online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
