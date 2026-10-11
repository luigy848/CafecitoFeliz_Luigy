import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    imageURL: { type: String, default: "https://placehold.co/600x400" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
