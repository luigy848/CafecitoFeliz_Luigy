import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    name: { type: String, required: true, trim: true },
    code: { type: String, unique: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
