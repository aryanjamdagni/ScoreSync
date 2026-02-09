import ApiError from "../utils/ApiError.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import User from "../models/User.js";

export const OwnerController = {
  dashboard: async (req, res) => {
    const ownerId = req.user._id;

    const store = await Store.findOne({ ownerUserId: ownerId });
    if (!store) {
      return res.json({ success: true, store: null, avgRating: 0, totalRatings: 0, raters: [] });
    }

    const ratings = await Rating.find({ storeId: store._id })
      .sort({ updatedAt: -1 })
      .lean();

    const totalRatings = ratings.length;
    const avgRating =
      totalRatings === 0
        ? 0
        : Math.round((ratings.reduce((a, r) => a + r.value, 0) / totalRatings) * 10) / 10;

    const userIds = ratings.map((r) => r.userId);
    const users = await User.find({ _id: { $in: userIds } }).select("name email").lean();

    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const raters = ratings.map((r) => {
      const u = userMap.get(String(r.userId));
      return {
        id: r._id,
        name: u?.name || "Unknown User",
        email: u?.email || "unknown@email.com",
        rating: r.value,
        updatedAt: new Date(r.updatedAt).toISOString().slice(0, 10)
      };
    });

    res.json({
      success: true,
      store: { id: store._id, name: store.name, address: store.address },
      avgRating,
      totalRatings,
      raters
    });
  }
};
