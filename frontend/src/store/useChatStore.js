import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatRoomStore } from "./useChatRoomStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket || !socket.connected) {
      console.warn("Socket not connected, retrying in 1 second...");
      setTimeout(() => {
        const retrySocket = useAuthStore.getState().socket;
        if (retrySocket && retrySocket.connected) {
          retrySocket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser =
              newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
              messages: [...get().messages, newMessage],
            });
          });
        }
      }, 1000);
      return;
    }

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("Socket not available for unsubscribing");
      return;
    }
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    // 1. Update its own state
    set({ selectedUser });
    // 2. Reset the other store's state directly
    if (selectedUser) {
      useChatRoomStore.setState({ selectedChatRoom: null });
    }
  },
}));
