import { useState } from "react";
import { useChatRoomStore } from "../store/useChatRoomStore";
import { useChatStore } from "../store/useChatStore";
import { X, Search, Send, UserPlus, Loader2 } from "lucide-react";

const InviteUserModal = ({ isOpen, onClose, room }) => {
  const { users } = useChatStore();
  const { inviteUser } = useChatRoomStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isInviting, setIsInviting] = useState(false);

  if (!isOpen || !room) {
    return null;
  }

  const nonMemberUsers = users.filter(
    (user) => !room.members.some((member) => member.user._id === user._id)
  );

  const filteredUsers = nonMemberUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = async () => {
    if (!selectedUserId) return;
    setIsInviting(true);
    await inviteUser(room._id, selectedUserId);
    setIsInviting(false);
    setSelectedUserId(null);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box relative bg-base-100 backdrop-blur-md border border-base-300 shadow-xl p-8 max-w-md max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg mb-4">
            <UserPlus className="w-8 h-8 text-primary-content" />
          </div>
          <h2 className="text-2xl font-bold text-base-content truncate">
            Invite to <span className="text-primary">{room.name}</span>
          </h2>
          <p className="text-base-content/70 mt-2">
            Select a user to send an invitation.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-12 pr-4 py-3 input input-bordered rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUserId(user._id)}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  selectedUserId === user._id
                    ? "bg-primary/10 border-primary"
                    : "border-transparent hover:bg-base-200"
                }`}
              >
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img
                      src={user.profilePic || "/avatar-placeholder.png"}
                      alt={user.fullName}
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className="font-semibold text-base-content">
                  {user.fullName}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-base-content/50 py-8">
              No users found.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-base-300 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInvite}
            disabled={!selectedUserId || isInviting}
            className="btn btn-primary flex-1"
          >
            {isInviting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {isInviting ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default InviteUserModal;
