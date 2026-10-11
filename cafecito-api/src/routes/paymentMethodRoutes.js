import express from "express";
import { body, param, query } from "express-validator";
import {
  getPaymentMethodsByCustomer,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethodController.js";
import validate from "../middlewares/validation.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isStaff from "../middlewares/isStaffMiddleware.js";

const router = express.Router();

const methodIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Payment method ID must be a valid MongoDB ObjectId"),
];

const customerQueryValidation = [
  query("customerId")
    .isMongoId()
    .withMessage("Customer ID must be a valid MongoDB ObjectId"),
];

const createMethodValidation = [
  body("customerId")
    .isMongoId()
    .withMessage("Customer ID must be a valid MongoDB ObjectId"),
  body("type")
    .isIn([
      "credit_card",
      "debit_card",
      "paypal",
      "bank_transfer",
      "cash_on_delivery",
    ])
    .withMessage("Invalid payment method type"),
  body("cardNumber")
    .optional()
    .isNumeric()
    .withMessage("Card number must contain only digits")
    .isLength({ max: 16 })
    .withMessage("Card number must have 16 digits maximum"),
  body("cvv")
    .optional()
    .isNumeric()
    .withMessage("CVV must contain only digits")
    .isLength({ min: 3, max: 3 })
    .withMessage("CVV must have exactly 3 digits"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be true or false"),
];

router.get(
  "/payment-methods",
  authMiddleware,
  isStaff,
  customerQueryValidation,
  validate,
  getPaymentMethodsByCustomer,
);

router.get(
  "/payment-methods/:id",
  authMiddleware,
  isStaff,
  methodIdValidation,
  validate,
  getPaymentMethodById,
);

router.post(
  "/payment-methods",
  authMiddleware,
  isStaff,
  createMethodValidation,
  validate,
  createPaymentMethod,
);

router.put(
  "/payment-methods/:id",
  authMiddleware,
  isStaff,
  methodIdValidation,
  validate,
  updatePaymentMethod,
);

router.delete(
  "/payment-methods/:id",
  authMiddleware,
  isStaff,
  methodIdValidation,
  validate,
  deletePaymentMethod,
);

export default router;
