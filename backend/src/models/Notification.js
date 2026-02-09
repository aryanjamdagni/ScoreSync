import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["RATING_RECEIVED", "OWNER_REGISTERED", "INFO"],
      default: "INFO",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },

    meta: {
      storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
      raterUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number },
      ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
