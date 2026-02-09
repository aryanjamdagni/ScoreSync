import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true, maxlength: 400, trim: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

storeSchema.index({ name: 1 });
storeSchema.index({ address: 1 });

export default mongoose.model("Store", storeSchema);
