import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useChatRoomStore } from "../store/useChatRoomStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import CreateChatRoomModal from "./CreateChatRoomModal";
import InviteUserModal from "./InviteUserModal";
import InvitationsModal from "./InvitationsModal";
import {
  Users,
  Search,
  MessageSquare,
  UserPlus,
  Hash,
  Plus,
  LogIn,
  Bell,
} from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const {
    getChatRooms,
    chatRooms,
    selectedChatRoom,
    setSelectedChatRoom,
    isLoadingChatRooms,
    getInvitations,
    invitations,
  } = useChatRoomStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("direct"); // "direct" or "rooms"
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [, setShowJoinRoomModal] = useState(false);
  const [showInvitationsModal, setShowInvitationsModal] = useState(false);
  const [roomToInvite, setRoomToInvite] = useState(null);

  useEffect(() => {
    getUsers();
    getChatRooms();
    getInvitations();
  }, [getUsers, getChatRooms, getInvitations]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesOnlineFilter = showOnlineOnly
      ? onlineUsers.includes(user._id)
      : true;
    return matchesSearch && matchesOnlineFilter;
  });

  const filteredChatRooms = chatRooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleChatRoomSelect = (chatRoom) => {
    setSelectedChatRoom(chatRoom);
  };

  const handleInviteToRoom = (room) => {
    setRoomToInvite(room);
  };

  if (isUsersLoading && isLoadingChatRooms) return <SidebarSkeleton />;

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col bg-base-100 transition-all duration-200">
        {/* Header */}
        <div className="border-b border-base-300 w-full p-4">
          <div className="flex items-center gap-2">
            <Users className="size-6 text-primary" />
            <span className="font-medium hidden lg:block text-base-content">
              Contacts
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-base-300">
          <button
            onClick={() => setActiveTab("direct")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "direct"
                ? "border-b-2 border-primary text-primary"
                : "text-base-content/70 hover:text-base-content"
            }`}
          >
            <MessageSquare className="size-4 lg:hidden mx-auto" />
            <span className="hidden lg:inline">Direct</span>
          </button>
          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === "rooms"
                ? "border-b-2 border-primary text-primary"
                : "text-base-content/70 hover:text-base-content"
            }`}
          >
            <Hash className="size-4 lg:hidden mx-auto" />
            <span className="hidden lg:inline">Rooms</span>
            {chatRooms.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chatRooms.length}
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-3 border-b border-base-300 flex gap-2">
          {activeTab === "rooms" && (
            <>
              <button
                onClick={() => setShowCreateRoomModal(true)}
                className="flex-1 btn btn-sm btn-primary"
              >
                <Plus className="size-4" />
                <span className="hidden lg:inline">Create</span>
              </button>
              <button
                onClick={() => setShowJoinRoomModal(true)}
                className="btn btn-sm btn-outline"
              >
                <LogIn className="size-4" />
                <span className="hidden lg:inline">Join</span>
              </button>
            </>
          )}
          <button
            onClick={() => setShowInvitationsModal(true)}
            className="btn btn-sm btn-ghost relative"
          >
            <Bell className="size-4" />
            {invitations && invitations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {invitations.length}
              </span>
            )}
            <span className="hidden lg:inline ml-2">Invites</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 size-4" />
            <input
              type="text"
              placeholder={`Search ${
                activeTab === "direct" ? "contacts" : "rooms"
              }...`}
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Online Filter (only for direct messages) */}
        {activeTab === "direct" && (
          <div className="px-3 pb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span className="text-sm hidden lg:inline text-base-content">
                Show online only
              </span>
              <div className="lg:hidden">
                <div
                  className={`w-2 h-2 rounded-full ${
                    showOnlineOnly ? "bg-success" : "bg-base-content/30"
                  }`}
                />
              </div>
            </label>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto w-full py-3 flex-1">
          {activeTab === "direct" ? (
            <DirectMessagesTab
              filteredUsers={filteredUsers}
              selectedUser={selectedUser}
              onUserSelect={handleUserSelect}
              onlineUsers={onlineUsers}
              searchTerm={searchTerm}
            />
          ) : (
            <ChatRoomsTab
              filteredChatRooms={filteredChatRooms}
              selectedChatRoom={selectedChatRoom}
              onChatRoomSelect={handleChatRoomSelect}
              searchTerm={searchTerm}
              onInviteToRoom={handleInviteToRoom}
            />
          )}
        </div>
      </aside>

      {/* Modals */}
      <CreateChatRoomModal
        isOpen={showCreateRoomModal}
        onClose={() => setShowCreateRoomModal(false)}
      />

      <InviteUserModal
        isOpen={!!roomToInvite}
        onClose={() => setRoomToInvite(null)}
        room={roomToInvite}
      />

      <InvitationsModal
        isOpen={showInvitationsModal}
        onClose={() => setShowInvitationsModal(false)}
      />
    </>
  );
};

const DirectMessagesTab = ({
  filteredUsers,
  selectedUser,
  onUserSelect,
  onlineUsers,
  searchTerm,
}) => {
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center text-base-content/50 py-8">
        <Users className="size-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          {searchTerm ? "No contacts found" : "No online users"}
        </p>
        <p className="text-sm opacity-75">
          {searchTerm
            ? "Try a different search term"
            : "Invite friends to start chatting"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-3">
      {filteredUsers.map((user) => {
        const isOnline = onlineUsers.includes(user._id);
        const isSelected = selectedUser?._id === user._id;

        return (
          <button
            key={user._id}
            onClick={() => onUserSelect(user)}
            className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 group ${
              isSelected
                ? "bg-primary text-primary-content shadow-md"
                : "hover:bg-base-300 text-base-content"
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar-placeholder.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full ring-2 ring-base-100"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full ring-2 ring-base-100" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div
                className={`font-medium truncate ${
                  isSelected ? "text-primary-content" : "text-base-content"
                }`}
              >
                {user.fullName}
              </div>
              <div
                className={`text-sm flex items-center gap-1 ${
                  isSelected
                    ? "text-primary-content/80"
                    : "text-base-content/70"
                }`}
              >
                {isOnline && (
                  <span className="size-2 bg-success rounded-full" />
                )}
                <span>{isOnline ? "Online" : "Offline"}</span>
                {isOnline && (
                  <span className="text-xs opacity-75">• Active now</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const ChatRoomsTab = ({
  filteredChatRooms,
  selectedChatRoom,
  onChatRoomSelect,
  searchTerm,
  onInviteToRoom,
}) => {
  if (filteredChatRooms.length === 0) {
    return (
      <div className="text-center text-base-content/50 py-8">
        <Hash className="size-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          {searchTerm ? "No rooms found" : "No chat rooms yet"}
        </p>
        <p className="text-sm opacity-75 mb-4">
          Create or join a room to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-3">
      {filteredChatRooms.map((room) => {
        const isSelected = selectedChatRoom?._id === room._id;
        const memberCount = room.memberCount || room.members?.length || 0;

        return (
          <div key={room._id} className="relative group">
            <button
              onClick={() => onChatRoomSelect(room)}
              className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 ${
                isSelected
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-300 text-base-content"
              }`}
            >
              <div className="mx-auto lg:mx-0">
                <div
                  className={`size-12 rounded-full flex items-center justify-center ${
                    isSelected
                      ? "bg-primary-content/20"
                      : "bg-primary text-primary-content"
                  } font-semibold`}
                >
                  <Hash className="size-6" />
                </div>
              </div>

              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div
                  className={`font-medium truncate flex items-center gap-2 ${
                    isSelected ? "text-primary-content" : "text-base-content"
                  }`}
                >
                  {room.name}
                  {room.isPrivate && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-primary-content/20 text-primary-content"
                          : "bg-base-300 text-base-content/70"
                      }`}
                    >
                      Private
                    </span>
                  )}
                </div>
                <div
                  className={`text-sm ${
                    isSelected
                      ? "text-primary-content/80"
                      : "text-base-content/70"
                  }`}
                >
                  {memberCount} members
                </div>
              </div>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onInviteToRoom(room);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity btn btn-xs btn-ghost"
            >
              <UserPlus className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
