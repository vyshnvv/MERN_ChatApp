// controllers/room.controller.js
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    const ownerId = req.user._id;

    const newRoom = new Room({
      name,
      description,
      owner: ownerId,
      members: [
        {
          user: ownerId,
          role: "admin",
        },
      ],
    });

    await newRoom.save();
    await newRoom.populate("members.user", "-password");
    await newRoom.populate("owner", "-password");

    res.status(201).json(newRoom);
  } catch (error) {
    console.log("Error in createRoom", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserRooms = async (req, res) => {
  try {
    const userId = req.user._id;

    const rooms = await Room.find({
      "members.user": userId,
    })
      .populate("owner", "-password")
      .populate("members.user", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    console.log("Error in getUserRooms", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const inviteUserToRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const inviterId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is member or owner
    const isMember = room.members.some(
      (member) => member.user.toString() === inviterId.toString()
    );
    if (!isMember && room.owner.toString() !== inviterId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to invite users" });
    }

    // Check if user is already invited or member
    const isAlreadyMember = room.members.some(
      (member) => member.user.toString() === userId
    );
    const hasInvitation = room.invitations.some(
      (inv) => inv.invitedUser.toString() === userId && inv.status === "pending"
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }
    if (hasInvitation) {
      return res
        .status(400)
        .json({ message: "User already has a pending invitation" });
    }

    room.invitations.push({
      invitedUser: userId,
      invitedBy: inviterId,
    });

    await room.save();

    // Notify invited user via socket
    const receiverSocketId = getReceiverSocketId(userId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("roomInvitation", {
        roomId: room._id,
        roomName: room.name,
        invitedBy: req.user.fullName,
      });
    }

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.log("Error in inviteUserToRoom", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserInvitations = async (req, res) => {
  try {
    const userId = req.user._id;

    const rooms = await Room.find({
      "invitations.invitedUser": userId,
      "invitations.status": "pending",
    })
      .populate("owner", "-password")
      .populate("invitations.invitedBy", "-password");

    const invitations = [];
    rooms.forEach((room) => {
      room.invitations.forEach((invitation) => {
        if (
          invitation.invitedUser.toString() === userId.toString() &&
          invitation.status === "pending"
        ) {
          invitations.push({
            _id: invitation._id,
            room: {
              _id: room._id,
              name: room.name,
              description: room.description,
            },
            invitedBy: invitation.invitedBy,
            createdAt: invitation.createdAt,
          });
        }
      });
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.log("Error in getUserInvitations", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const respondToInvitation = async (req, res) => {
  try {
    const { roomId, response } = req.body; // response: "accept" or "decline"
    const userId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const invitation = room.invitations.find(
      (inv) =>
        inv.invitedUser.toString() === userId.toString() &&
        inv.status === "pending"
    );

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    invitation.status = response === "accept" ? "accepted" : "declined";

    if (response === "accept") {
      room.members.push({
        user: userId,
        role: "member",
      });
    }

    await room.save();
    res.status(200).json({ message: `Invitation ${invitation.status}` });
  } catch (error) {
    console.log("Error in respondToInvitation", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is a member
    const isMember = room.members.some(
      (member) => member.user.toString() === userId.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      roomId: roomId,
      messageType: "room",
    })
      .populate("senderId", "-password")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getRoomMessages", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendRoomMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // 'image' is expected to be a base64 Data URL
    const { roomId } = req.params;
    const senderId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is a member
    const isMember = room.members.some(
      (member) => member.user.toString() === senderId.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    let imageUrl;
    if (image) {
      try {
        // Validate that we received a proper Data URL string from the frontend
        if (typeof image !== "string" || !image.startsWith("data:image")) {
          return res.status(400).json({ message: "Invalid image data format" });
        }

        console.log("Uploading Data URL to Cloudinary, length:", image.length);

        // Upload the full Data URL directly to Cloudinary.
        // It automatically handles parsing, format detection, and uploading.
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "chat-room-images",
          resource_type: "image",
          transformation: [
            { width: 800, height: 600, crop: "limit" }, // Optimize image size
            { quality: "auto" },
          ],
        });

        imageUrl = uploadResponse.secure_url;
        console.log("Successfully uploaded image to Cloudinary:", imageUrl);
      } catch (uploadError) {
        console.log("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({
          message: "Error uploading image",
          error: uploadError.message,
        });
      }
    }

    const newMessage = new Message({
      senderId,
      roomId,
      text,
      image: imageUrl,
      messageType: "room",
    });

    await newMessage.save();
    await newMessage.populate("senderId", "-password");

    // Emit to all room members in real-time
    room.members.forEach((member) => {
      const memberSocketId = getReceiverSocketId(member.user.toString());
      if (memberSocketId && member.user.toString() !== senderId.toString()) {
        io.to(memberSocketId).emit("newRoomMessage", newMessage);
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendRoomMessage", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // 1. Find the room
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 2. CRITICAL: Check if the user is the owner
    if (room.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner of this room." });
    }

    // 3. Delete the room and all its associated messages
    await Room.findByIdAndDelete(id);
    await Message.deleteMany({ roomId: id });

    // 4. Send success response
    res
      .status(200)
      .json({ message: "Room and its messages deleted successfully" });
  } catch (error) {
    console.log("Error in deleteRoom", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
