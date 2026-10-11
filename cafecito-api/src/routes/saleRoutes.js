import express from "express";
import { body, param } from "express-validator";
import {
  createSale,
  getSales,
  getSaleById,
  updateSaleStatus,
} from "../controllers/saleController.js";
import validate from "../middlewares/validation.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isStaff from "../middlewares/isStaffMiddleware.js";

const router = express.Router();

const saleIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Sale ID must be a valid MongoDB ObjectId"),
];

const createSaleValidation = [
  body("customerId")
    .optional()
    .isMongoId()
    .withMessage("Customer ID must be a valid MongoDB ObjectId"),
  body("items").isArray({ min: 1 }).withMessage("Items must be a filled array"),
  body("items.*.productId")
    .isMongoId()
    .withMessage("Each item needs a valid product ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Each item needs a quantity greater than 0"),
  body("paymentType")
    .optional()
    .isIn(["cash", "credit_card", "debit_card", "bank_transfer"])
    .withMessage("Invalid payment type"),
  body("paymentMethodId")
    .optional()
    .isMongoId()
    .withMessage("Payment method ID must be a valid MongoDB ObjectId"),
];

const updateStatusValidation = [
  param("id")
    .isMongoId()
    .withMessage("Sale ID must be a valid MongoDB ObjectId"),
  body("status")
    .optional()
    .isIn(["pending", "preparing", "ready", "delivered", "cancelled"])
    .withMessage("Invalid sale status"),
  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Invalid payment status"),
];

router.get("/sales", authMiddleware, isStaff, getSales);

router.get(
  "/sales/:id",
  authMiddleware,
  isStaff,
  saleIdValidation,
  validate,
  getSaleById,
);

router.post(
  "/sales",
  authMiddleware,
  isStaff,
  createSaleValidation,
  validate,
  createSale,
);

router.put(
  "/sales/:id/status",
  authMiddleware,
  isStaff,
  updateStatusValidation,
  validate,
  updateSaleStatus,
);

export default router;
