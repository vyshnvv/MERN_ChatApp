import { X, Phone, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="bg-base-100 border-b border-base-300 shadow-sm relative">
      {/* Gradient border at top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-80"></div>

      <div className="p-4 flex items-center justify-between">
        {/* Left side - User info */}
        <div className="flex items-center gap-4">
          {/* Avatar with online status */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-base-100">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100">
                <div className="w-full h-full bg-success rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* User details */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-base-content text-lg">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-success" : "bg-base-content/40"
                } animate-pulse`}
              ></div>
              <p
                className={`text-sm font-medium ${
                  isOnline ? "text-success" : "text-base-content/70"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
              {isOnline && (
                <span className="text-xs text-base-content/50">
                  • Active now
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          {/* Call buttons */}
          <button className="btn btn-ghost btn-sm btn-circle text-base-content hover:text-primary">
            <Phone className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-sm btn-circle text-base-content hover:text-primary">
            <Video className="w-5 h-5" />
          </button>

          {/* More options button */}
          <button className="btn btn-ghost btn-sm btn-circle text-base-content hover:text-primary">
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Close button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-sm btn-circle text-base-content hover:text-error hover:bg-error/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subtle bottom shadow */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-base-300 to-transparent"></div>
    </div>
  );
};

export default ChatHeader;
