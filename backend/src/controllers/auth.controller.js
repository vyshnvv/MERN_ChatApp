import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields should be filled" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatarStyles = [
      "identicon",
      "bottts",
      "avataaars",
      "micah",
      "open-peeps",
    ];
    const randomStyle =
      avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    const seed = encodeURIComponent(fullName + Date.now());
    const profilePic = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic, 
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ messsage: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Sever Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPassCorrect = await bcrypt.compare(password, user.password);

    if (!isPassCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Sever Error" });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the JWT cookie with proper options
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true, // Add this for security
      secure: process.env.NODE_ENV === "development", // Only send over HTTPS in production
      sameSite: "strict", // Add CSRF protection
      path: "/", // Ensure cookie is cleared for entire site
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic } = req.body;
    const userId = req.user._id;

    let updatedFields = {};

    // Handle profile picture upload
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updatedFields.profilePic = uploadResponse.secure_url;
    }

    // Handle full name update
    if (fullName) {
      if (fullName.trim().length < 3) {
        return res
          .status(400)
          .json({ message: "Full name must be at least 3 characters" });
      }
      updatedFields.fullName = fullName;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    }).select("-password"); // Exclude password from the response

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ADD THIS ENTIRE NEW FUNCTION
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPassCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in changePassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Sever Error" });
  }
};
