import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import { pushNotification } from "../utils/notify.js";

function mapUser(u) {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    address: u.address,
    role: u.role,
    createdAt: u.createdAt,
  };
}

function mapStore(s) {
  return {
    id: s._id,
    name: s.name,
    email: s.email,
    address: s.address,
    ownerUserId: s.ownerUserId,
    createdAt: s.createdAt,
  };
}

export const AdminController = {
  stats: async (_req, res) => {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.countDocuments({}),
      Store.countDocuments({}),
      Rating.countDocuments({}),
    ]);

    res.json({ totalUsers, totalStores, totalRatings });
  },

  listUsers: async (req, res) => {
    const {
      name = "",
      email = "",
      address = "",
      role,
      sortBy = "createdAt",
      sortDir = "desc",
    } = req.validated.query;

    const filter = {};
    if (name?.trim()) filter.name = { $regex: name.trim(), $options: "i" };
    if (email?.trim()) filter.email = { $regex: email.trim(), $options: "i" };
    if (address?.trim()) filter.address = { $regex: address.trim(), $options: "i" };
    if (role) filter.role = role;

    const sort = { [sortBy]: sortDir === "asc" ? 1 : -1 };

    const users = await User.find(filter).sort(sort).select("_id name email address role createdAt");
    res.json({ success: true, users: users.map(mapUser) });
  },

  createUser: async (req, res) => {
    const { name, email, address, password, role } = req.validated.body;

    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "Email already in use");

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      name,
      email,
      address,
      passwordHash,
      role,
    });

    if (role === "OWNER") {
      const allUsers = await User.find({ role: "USER" }).select("_id");
      await Promise.all(
        allUsers.map((u) =>
          pushNotification({
            recipientId: u._id,
            type: "OWNER_REGISTERED",
            title: "New store owner joined",
            message: `${name} registered as a new store owner.`,
            meta: { ownerUserId: user._id },
          })
        )
      );
    }

    res.status(201).json({ success: true, user: mapUser(user) });
  },

  listStores: async (req, res) => {
    const {
      name = "",
      email = "",
      address = "",
      sortBy = "createdAt",
      sortDir = "desc",
    } = req.validated.query;

    const filter = {};
    if (name?.trim()) filter.name = { $regex: name.trim(), $options: "i" };
    if (email?.trim()) filter.email = { $regex: email.trim(), $options: "i" };
    if (address?.trim()) filter.address = { $regex: address.trim(), $options: "i" };

    const sort = { [sortBy]: sortDir === "asc" ? 1 : -1 };

    const stores = await Store.find(filter).sort(sort).select("_id name email address ownerUserId createdAt");
    res.json({ success: true, stores: stores.map(mapStore) });
  },

  createStore: async (req, res) => {
    const { name, email, address, ownerUserId = null } = req.validated.body;

    const existing = await Store.findOne({ $or: [{ email }, { name }] });
    if (existing) throw new ApiError(409, "Store with same name/email already exists");

    const store = await Store.create({
      name,
      email,
      address,
      ownerUserId: ownerUserId || null,
    });

    res.status(201).json({ success: true, store: mapStore(store) });
  },
};
