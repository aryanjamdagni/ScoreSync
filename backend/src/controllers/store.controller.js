import ApiError from "../utils/ApiError.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import mongoose from "mongoose";
import { pushNotification } from "../utils/notify.js";
import User from "../models/User.js";

export const StoreController = {
  listStoresForUser: async (req, res) => {
    const userId = req.user._id;
    const { q = "", sortBy = "name", sortDir = "asc" } = req.validated.query;

    const filter = {};
    if (q?.trim()) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
      ];
    }

    const sort = { [sortBy]: sortDir === "asc" ? 1 : -1 };

    const stores = await Store.aggregate([
      { $match: filter },
      { $sort: sort },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "storeId",
          as: "ratings",
        },
      },
      {
        $addFields: {
          totalRatings: { $size: "$ratings" },
          avgRating: {
            $cond: [
              { $gt: [{ $size: "$ratings" }, 0] },
              { $round: [{ $avg: "$ratings.value" }, 1] },
              0,
            ],
          },
          myRating: {
            $let: {
              vars: {
                mine: {
                  $first: {
                    $filter: {
                      input: "$ratings",
                      as: "r",
                      cond: {
                        $eq: ["$$r.userId", new mongoose.Types.ObjectId(userId)],
                      },
                    },
                  },
                },
              },
              in: { $ifNull: ["$$mine.value", 0] },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          avgRating: 1,
          totalRatings: 1,
          myRating: 1,
        },
      },
    ]);

    res.json({
      success: true,
      stores: stores.map((s) => ({
        id: s._id,
        name: s.name,
        address: s.address,
        avgRating: s.avgRating || 0,
        totalRatings: s.totalRatings || 0,
        myRating: s.myRating || 0,
      })),
    });
  },

  rateStore: async (req, res) => {
    const userId = req.user._id;
    const { storeId } = req.validated.params;
    const { value } = req.validated.body;

    const store = await Store.findById(storeId);
    if (!store) throw new ApiError(404, "Store not found");

    // upsert rating
    const rating = await Rating.findOneAndUpdate(
      { storeId, userId },
      { $set: { value } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // ✅ Notify owner if mapped
    if (store.ownerUserId) {
      const rater = await User.findById(userId).select("name email");
      const title = "New rating received";
      const message = `${
        rater?.name || "A user"
      } rated your store "${store.name}" with ${value} ⭐`;

      await pushNotification({
        recipientId: store.ownerUserId,
        type: "RATING_RECEIVED",
        title,
        message,
        meta: {
          storeId: store._id,
          raterUserId: userId,
          rating: value,
        },
      });
    }

    res.json({
      success: true,
      rating: { id: rating._id, storeId, userId, value },
    });
  },
};

