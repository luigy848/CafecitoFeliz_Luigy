import express from "express";
import { body, param } from "express-validator";
import {
  getUsers,
  getUserById,
  getMe,
  createUser,
  updateUser,
  deactivateUser,
} from "../controllers/userController.js";
import validate from "../middlewares/validation.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";

const router = express.Router();

const userIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
];

const createUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["cashier", "admin"])
    .withMessage("Role must be cashier or admin"),
];

const updateUserValidation = [
  param("id")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["cashier", "admin"])
    .withMessage("Role must be cashier or admin"),
];

router.get("/users/me", authMiddleware, getMe);

router.get("/users", authMiddleware, isAdmin, getUsers);

router.get(
  "/users/:id",
  authMiddleware,
  isAdmin,
  userIdValidation,
  validate,
  getUserById,
);

router.post(
  "/users",
  authMiddleware,
  isAdmin,
  createUserValidation,
  validate,
  createUser,
);

router.put(
  "/users/:id",
  authMiddleware,
  updateUserValidation,
  validate,
  updateUser,
);

router.delete(
  "/users/:id",
  authMiddleware,
  isAdmin,
  userIdValidation,
  validate,
  deactivateUser,
);

export default router;
