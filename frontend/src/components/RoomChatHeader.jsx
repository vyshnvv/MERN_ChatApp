import { useState } from "react";
import { useChatRoomStore } from "../store/useChatRoomStore";
import { Info, Hash, X, ArrowLeft, Trash2, Edit3 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const RoomChatHeader = () => {
  const { selectedChatRoom, setSelectedChatRoom, deleteChatRoom } =
    useChatRoomStore();
  const { authUser } = useAuthStore();
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteRoom = async () => {
    setIsDeleting(true);
    try {
      await deleteChatRoom(selectedChatRoom._id);
      setSelectedChatRoom(null);
      setShowRoomInfo(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete room:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Guard clause: If no room is selected, render nothing.
  if (!selectedChatRoom) {
    return null;
  }

  // Determine if the current authenticated user is the owner of the room
  const isOwner = authUser?._id === selectedChatRoom.owner._id;

  return (
    <>
      {/* Main Header Container */}
      <div className="bg-base-100 border-b border-base-300 shadow-sm relative z-10">
        <div className="p-3 sm:p-4 flex items-center justify-between">
          {/* Left Side: Back button (mobile) + Room Info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Mobile Back Button: Navigates back to the sidebar view */}
            <button
              onClick={() => setSelectedChatRoom(null)}
              className="md:hidden p-2 text-base-content hover:bg-base-200 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Room Icon */}
            <div className="w-10 h-10 bg-primary text-primary-content rounded-full flex items-center justify-center flex-shrink-0">
              <Hash className="w-5 h-5" />
            </div>

            {/* Room Name & Member Count (handles text overflow) */}
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="font-semibold text-base-content text-sm sm:text-lg truncate">
                {selectedChatRoom.name}
              </h3>
              <p className="text-xs sm:text-sm text-base-content/70 truncate">
                {selectedChatRoom.members.length} members
              </p>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setShowRoomInfo(!showRoomInfo)}
              className={`btn btn-ghost btn-sm btn-circle ${
                showRoomInfo ? "bg-primary text-primary-content" : ""
              }`}
              aria-label="Room information"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Desktop Close Button: Hidden on mobile */}
            <button
              onClick={() => setSelectedChatRoom(null)}
              className="hidden md:block btn btn-ghost btn-sm btn-circle hover:bg-error hover:text-error-content"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Room Information Panel */}
      {showRoomInfo && (
        <div className="bg-base-200 border-b border-base-300 p-4">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div>
              <h4 className="font-semibold mb-1 text-base-content">
                About Room
              </h4>
              <p className="text-sm text-base-content/70">
                {selectedChatRoom.description || "No description provided."}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-base-content">
                Members ({selectedChatRoom.members.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {/* Room Owner */}
                <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-base-100">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={selectedChatRoom.owner.profilePic || "/avatar.png"}
                        alt={selectedChatRoom.owner.fullName}
                      />
                    </div>
                  </div>
                  <span className="font-medium text-base-content">
                    {selectedChatRoom.owner.fullName}
                  </span>
                  <span className="badge badge-warning badge-sm">Owner</span>
                </div>

                {/* Other Members */}
                {selectedChatRoom.members
                  .filter(
                    (member) => member.user._id !== selectedChatRoom.owner._id
                  )
                  .map((member) => (
                    <div
                      key={member.user._id}
                      className="flex items-center gap-3 text-sm p-2 rounded-lg bg-base-100"
                    >
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          <img
                            src={member.user.profilePic || "/avatar.png"}
                            alt={member.user.fullName}
                          />
                        </div>
                      </div>
                      <span className="text-base-content">
                        {member.user.fullName}
                      </span>
                      {member.role === "admin" && (
                        <span className="badge badge-info badge-sm">Admin</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Room Actions for Owner/Admin */}
            {isOwner && (
              <div className="pt-4 border-t border-base-300">
                <h4 className="font-semibold mb-2 text-base-content">
                  Room Management
                </h4>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit Room
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Room
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-2">Delete Room</h3>
            <p className="py-4">
              Are you sure you want to delete the room "{selectedChatRoom.name}
              "? This action cannot be undone and all messages will be
              permanently deleted.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteRoom}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete Room"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomChatHeader;
