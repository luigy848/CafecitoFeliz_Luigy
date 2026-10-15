import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: true, unique: true, trim: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true, trim: true },
        unitPrice: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true, min: 0 },
      },
    ],
    subtotal: { type: Number, required: true, min: 0 },
    discount: {
      reward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoyaltyReward",
        default: null,
      },
      name: { type: String, default: null },
      percentage: { type: Number, default: 0, min: 0, max: 15 },
      amount: { type: Number, default: 0, min: 0 },
    },
    total: { type: Number, required: true, min: 0 },
    visitsAtSale: { type: Number, required: true, min: 0 },
    paymentType: {
      type: String,
      enum: ["cash", "credit_card", "debit_card", "bank_transfer"],
      required: true,
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
      default: "preparing",
    },
    servedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

saleSchema.index({ customer: 1, createdAt: -1 });

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
