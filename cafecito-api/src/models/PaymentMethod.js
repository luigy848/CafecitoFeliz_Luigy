import mongoose from "mongoose";

const onlyDigits = (value) =>
  [...value].every((char) => "0123456789".includes(char));

const isValidExpiry = (value) => {
  const [month, year] = value.split("/");
  if (!month || !year) return false;
  if (month.length !== 2 || year.length !== 2) return false;
  if (!onlyDigits(month) || !onlyDigits(year)) return false;
  return Number(month) >= 1 && Number(month) <= 12;
};

const paymentMethodSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "credit_card",
        "debit_card",
        "paypal",
        "bank_transfer",
        "cash_on_delivery",
      ],
    },
    cardNumber: {
      type: String,
      trim: true,
      maxlength: 16,
      validate: {
        validator: onlyDigits,
        message: "El número de tarjeta solo acepta dígitos",
      },
    },
    cardHolderName: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: String,
      trim: true,
      validate: {
        validator: isValidExpiry,
        message: "La fecha de vencimiento debe tener el formato MM/YY",
      },
    },
    cvv: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => value.length === 3 && onlyDigits(value),
        message: "El CVV debe tener exactamente 3 dígitos",
      },
    },
    paypalEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

paymentMethodSchema.virtual("label").get(function () {
  if (this.cardNumber) {
    return `${this.type === "credit_card" ? "Crédito" : "Débito"} ****${this.cardNumber.slice(-4)}`;
  }
  if (this.type === "paypal") {
    return `PayPal ${this.paypalEmail || ""}`.trim();
  }
  if (this.type === "bank_transfer") {
    return `Transferencia ${this.bankName || ""}`.trim();
  }
  return "Efectivo";
});

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

export default PaymentMethod;
