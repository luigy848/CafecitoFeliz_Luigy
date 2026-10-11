import mongoose from "mongoose";

const loyaltyRewardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    minVisits: { type: Number, required: true, min: 1 },
    percentage: { type: Number, required: true, min: 1, max: 15 },
    windowDays: { type: Number, required: true, default: 90, min: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

loyaltyRewardSchema.index({ active: 1, minVisits: 1 });

const LoyaltyReward = mongoose.model("LoyaltyReward", loyaltyRewardSchema);

export default LoyaltyReward;
