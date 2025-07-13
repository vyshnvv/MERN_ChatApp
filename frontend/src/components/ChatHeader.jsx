import {
  X,
  Phone,
  Video,
  MoreVertical,
  Search,
  Star,
  Info,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm relative">
      {/* Gradient border at top */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-60"></div>

      <div className="p-4 flex items-center justify-between">
        {/* Left side - User info */}
        <div className="flex items-center gap-4">
          {/* Avatar with online status */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white/50 hover:border-purple-300 transition-all duration-300">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm">
                <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* User details */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 text-lg">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                } animate-pulse`}
              ></div>
              <p
                className={`text-sm font-medium ${
                  isOnline ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
              {isOnline && (
                <span className="text-xs text-gray-400">• Active now</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          {/* Close button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group ml-2"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Subtle bottom shadow */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </div>
  );
};

export default ChatHeader;
