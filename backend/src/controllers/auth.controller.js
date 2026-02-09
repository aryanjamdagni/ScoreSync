import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES
  });
}

export const AuthController = {
  register: async (req, res) => {
    const { name, email, address, password } = req.validated.body;

    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "Email already in use");

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      name,
      email,
      address,
      passwordHash,
      role: "USER" 
    });

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, address: user.address, role: user.role }
    });
  },

  login: async (req, res) => {
    const { email, password } = req.validated.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const ok = await user.comparePassword(password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const token = signAccessToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, address: user.address, role: user.role }
    });
  },

  me: async (req, res) => {
    res.json({ success: true, user: req.user });
  },

  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.validated.body;

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    const ok = await user.comparePassword(oldPassword);
    if (!ok) throw new ApiError(400, "Old password is incorrect");

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: "Password updated" });
  }
};
