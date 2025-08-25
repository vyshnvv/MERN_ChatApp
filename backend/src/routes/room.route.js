// routes/room.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createRoom,
  getUserRooms,
  inviteUserToRoom,
  getUserInvitations,
  respondToInvitation,
  getRoomMessages,
  sendRoomMessage,
  deleteRoom,
} from "../controllers/room.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createRoom);
router.get("/my-rooms", protectRoute, getUserRooms);
router.post("/invite", protectRoute, inviteUserToRoom);
router.get("/invitations", protectRoute, getUserInvitations);
router.post("/invitation/respond", protectRoute, respondToInvitation);
router.get("/:roomId/messages", protectRoute, getRoomMessages);
router.post("/:roomId/send", protectRoute, sendRoomMessage);
router.delete("/:id", protectRoute, deleteRoom);

export default router;
