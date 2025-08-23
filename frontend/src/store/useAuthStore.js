import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

let authCheckTimeout = null;
let lastAuthOperation = null;

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5002" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isChangingPassword: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async (immediate = false) => {
    const operationId = Date.now() + Math.random();
    lastAuthOperation = operationId;

    if (!immediate && authCheckTimeout) {
      clearTimeout(authCheckTimeout);
    }

    const executeAuthCheck = async () => {
      if (lastAuthOperation !== operationId) {
        return;
      }

      set({ isCheckingAuth: true });

      try {
        const res = await axiosInstance.get("/auth/check");

        if (lastAuthOperation !== operationId) {
          return;
        }

        if (
          typeof res.data === "object" &&
          res.data &&
          !res.data.toString().includes("<!doctype html>")
        ) {
          set({ authUser: res.data });
          get().connectSocket();
        } else {
          set({ authUser: null });
        }
      } catch (error) {
        if (lastAuthOperation !== operationId) {
          return;
        }

        // No need to show a toast error on initial auth check failures
        console.error(
          "Auth check failed:",
          error.response?.data?.message || error.message
        );

        set({ authUser: null });
      } finally {
        if (lastAuthOperation === operationId) {
          set({ isCheckingAuth: false });
        }
      }
    };

    if (immediate) {
      await executeAuthCheck();
    } else {
      authCheckTimeout = setTimeout(executeAuthCheck, 100);
    }
  },

  signUp: async (data) => {
    if (authCheckTimeout) {
      clearTimeout(authCheckTimeout);
      authCheckTimeout = null;
    }
    lastAuthOperation = null;

    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      // UPDATED: Robust error handling
      toast.error(
        error.response?.data?.message || "Sign up failed. Please try again."
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    if (authCheckTimeout) {
      clearTimeout(authCheckTimeout);
      authCheckTimeout = null;
    }
    lastAuthOperation = null;

    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      // UPDATED: Robust error handling
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (navigate) => {
    if (authCheckTimeout) {
      clearTimeout(authCheckTimeout);
      authCheckTimeout = null;
    }
    lastAuthOperation = null;

    set({ isLoggingOut: true, isCheckingAuth: false });

    try {
      get().disconnectSocket();
      set({ authUser: null });

      await axiosInstance.post("/auth/logout");

      if (navigate) {
        navigate("/login", { replace: true });
      }

      toast.success("Logged out successfully");
    } catch (error) {
      // UPDATED: Robust error handling
      console.error("Logout error:", error);

      // Ensure user is logged out on the client even if the server call fails
      set({ authUser: null });

      if (navigate) {
        navigate("/login", { replace: true });
      }

      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      // UPDATED: Robust error handling
      console.error("error in update profile:", error);
      toast.error(
        error.response?.data?.message ||
          "Profile update failed. Please try again."
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  changePassword: async (passwordData) => {
    set({ isChangingPassword: true });
    try {
      const res = await axiosInstance.post(
        "/auth/change-password",
        passwordData
      );
      toast.success(res.data.message);
      return true; // Indicate success
    } catch (error) {
      console.error("error in change password:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
      return false; // Indicate failure
    } finally {
      set({ isChangingPassword: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser) {
      console.warn("Cannot connect socket - no authenticated user");
      return;
    }

    if (socket?.connected) {
      return;
    }

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    set({ socket: newSocket });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null, onlineUsers: [] });
  },
}));
