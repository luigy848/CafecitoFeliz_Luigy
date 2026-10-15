import express from "express";
import { body, param, query } from "express-validator";
import {
  getCustomers,
  searchCustomerByPhone,
  getCustomerById,
  getCustomerBenefits,
  getCustomerSales,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
} from "../controllers/customerController.js";
import validate from "../middlewares/validation.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import isStaff from "../middlewares/isStaffMiddleware.js";

const router = express.Router();

const customerIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Customer ID must be a valid MongoDB ObjectId"),
];

const phoneQueryValidation = [
  query("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must have exactly 10 digits")
    .isNumeric()
    .withMessage("Phone must contain only digits"),
];

const createCustomerValidation = [
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must have exactly 10 digits")
    .isNumeric()
    .withMessage("Phone must contain only digits"),
  body("name").notEmpty().withMessage("Name is required"),
  body("birthDate")
    .optional()
    .isISO8601()
    .withMessage("birthDate must be a valid date (YYYY-MM-DD)"),
];

const updateCustomerValidation = [
  param("id")
    .isMongoId()
    .withMessage("Customer ID must be a valid MongoDB ObjectId"),
  body("phone")
    .optional()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must have exactly 10 digits")
    .isNumeric()
    .withMessage("Phone must contain only digits"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("birthDate")
    .optional()
    .isISO8601()
    .withMessage("birthDate must be a valid date (YYYY-MM-DD)"),
];

router.get("/customers", authMiddleware, isStaff, getCustomers);

router.get(
  "/customers/search",
  authMiddleware,
  isStaff,
  phoneQueryValidation,
  validate,
  searchCustomerByPhone,
);

router.get(
  "/customers/:id/benefits",
  authMiddleware,
  isStaff,
  customerIdValidation,
  validate,
  getCustomerBenefits,
);

router.get(
  "/customers/:id/sales",
  authMiddleware,
  isStaff,
  customerIdValidation,
  validate,
  getCustomerSales,
);

router.get(
  "/customers/:id",
  authMiddleware,
  isStaff,
  customerIdValidation,
  validate,
  getCustomerById,
);

router.post(
  "/customers",
  authMiddleware,
  isStaff,
  createCustomerValidation,
  validate,
  createCustomer,
);

router.put(
  "/customers/:id",
  authMiddleware,
  isStaff,
  updateCustomerValidation,
  validate,
  updateCustomer,
);

router.delete(
  "/customers/:id",
  authMiddleware,
  isAdmin,
  customerIdValidation,
  validate,
  deactivateCustomer,
);

export default router;
