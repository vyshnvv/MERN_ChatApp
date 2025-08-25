import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useChatRoomStore = create((set, get) => ({
  chatRooms: [],
  selectedChatRoom: null,
  roomMessages: [],
  invitations: [],
  isLoadingChatRooms: false,
  isRoomMessagesLoading: false,

  getChatRooms: async () => {
    set({ isLoadingChatRooms: true });
    try {
      const res = await axiosInstance.get("/rooms/my-rooms");
      set({ chatRooms: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching rooms");
    } finally {
      set({ isLoadingChatRooms: false });
    }
  },

  createChatRoom: async (roomData) => {
    try {
      const res = await axiosInstance.post("/rooms/create", roomData);
      set({ chatRooms: [...get().chatRooms, res.data] });
      toast.success("Room created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating room");
      throw error;
    }
  },

  getRoomMessages: async (roomId) => {
    set({ isRoomMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/rooms/${roomId}/messages`);
      set({ roomMessages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isRoomMessagesLoading: false });
    }
  },

  sendRoomMessage: async (roomId, messageData) => {
    try {
      // Debug logging
      console.log("Store: About to send message data:", {
        roomId,
        messageData: {
          text: messageData.text,
          image: messageData.image
            ? `${typeof messageData.image} (${messageData.image.length} chars)`
            : null,
        },
      });

      // Ensure we're sending JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Create a clean payload
      const payload = {
        text: messageData.text || "",
      };

      if (messageData.image && typeof messageData.image === "string") {
        payload.image = messageData.image;
      }

      console.log("Store: Final payload:", {
        text: payload.text,
        image: payload.image ? `string (${payload.image.length} chars)` : null,
      });

      const res = await axiosInstance.post(
        `/rooms/${roomId}/send`,
        payload,
        config
      );

      set({ roomMessages: [...get().roomMessages, res.data] });
      return res.data;
    } catch (error) {
      console.error("Store: Error sending message:", error);
      toast.error(error.response?.data?.message || "Error sending message");
      throw error;
    }
  },

  inviteUser: async (roomId, userId) => {
    try {
      await axiosInstance.post("/rooms/invite", { roomId, userId });
      toast.success("Invitation sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending invitation");
    }
  },

  getInvitations: async () => {
    try {
      const res = await axiosInstance.get("/rooms/invitations");
      set({ invitations: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching invitations"
      );
    }
  },

  respondToInvitation: async (roomId, response) => {
    try {
      await axiosInstance.post("/rooms/invitation/respond", {
        roomId,
        response,
      });
      await get().getInvitations(); // Refresh invitations
      await get().getChatRooms(); // Refresh rooms if accepted
      toast.success(`Invitation ${response}ed successfully!`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error responding to invitation"
      );
    }
  },

  subscribeToRoomMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newRoomMessage", (newMessage) => {
      const { selectedChatRoom, roomMessages } = get();
      if (selectedChatRoom && newMessage.roomId === selectedChatRoom._id) {
        set({ roomMessages: [...roomMessages, newMessage] });
      }
    });

    socket.on("roomInvitation", (invitation) => {
      toast.success(`You've been invited to join "${invitation.roomName}"`);
      get().getInvitations(); // Refresh invitations
    });
  },

  unsubscribeFromRoomMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newRoomMessage");
    socket.off("roomInvitation");
  },

  setSelectedChatRoom: (chatRoom) => {
    // 1. Update its own state
    set({ selectedChatRoom: chatRoom });
    // 2. Reset the other store's state directly
    if (chatRoom) {
      useChatStore.setState({ selectedUser: null });
    }
  },

  deleteChatRoom: async (roomId) => {
    try {
      // Optimistically remove the room from the UI
      set((state) => ({
        chatRooms: state.chatRooms.filter((room) => room._id !== roomId),
        selectedChatRoom: null, // Deselect the room after deleting
      }));

      await axiosInstance.delete(`/rooms/${roomId}`);
      toast.success("Room deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting room");
      // If the API call fails, refresh the rooms to revert the optimistic update
      get().getChatRooms();
    }
  },
}));
