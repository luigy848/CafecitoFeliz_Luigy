import express from "express";
import { body, param } from "express-validator";
import {
  getLoyaltyRewards,
  getLoyaltyRewardById,
  createLoyaltyReward,
  updateLoyaltyReward,
  deleteLoyaltyReward,
} from "../controllers/loyaltyRewardController.js";
import validate from "../middlewares/validation.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";

const router = express.Router();

const rewardIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Reward ID must be a valid MongoDB ObjectId"),
];

const createRewardValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("minVisits")
    .isInt({ min: 1 })
    .withMessage("minVisits must be an integer greater than 0"),
  body("percentage")
    .isInt({ min: 1, max: 15 })
    .withMessage("percentage must be between 1 and 15"),
  body("windowDays")
    .optional()
    .isInt({ min: 1 })
    .withMessage("windowDays must be an integer greater than 0"),
];

const updateRewardValidation = [
  param("id")
    .isMongoId()
    .withMessage("Reward ID must be a valid MongoDB ObjectId"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("minVisits")
    .optional()
    .isInt({ min: 1 })
    .withMessage("minVisits must be an integer greater than 0"),
  body("percentage")
    .optional()
    .isInt({ min: 1, max: 15 })
    .withMessage("percentage must be between 1 and 15"),
  body("active")
    .optional()
    .isBoolean()
    .withMessage("active must be true or false"),
];

router.get("/loyalty-rewards", getLoyaltyRewards);

router.get(
  "/loyalty-rewards/:id",
  rewardIdValidation,
  validate,
  getLoyaltyRewardById,
);

router.post(
  "/loyalty-rewards",
  authMiddleware,
  isAdmin,
  createRewardValidation,
  validate,
  createLoyaltyReward,
);

router.put(
  "/loyalty-rewards/:id",
  authMiddleware,
  isAdmin,
  updateRewardValidation,
  validate,
  updateLoyaltyReward,
);

router.delete(
  "/loyalty-rewards/:id",
  authMiddleware,
  isAdmin,
  rewardIdValidation,
  validate,
  deleteLoyaltyReward,
);

export default router;
