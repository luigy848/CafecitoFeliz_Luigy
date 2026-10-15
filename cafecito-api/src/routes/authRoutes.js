import express from "express";
import { body } from "express-validator";
import { login, getProfiles } from "../controllers/authController.js";
import validate from "../middlewares/validation.js";

const router = express.Router();

const loginValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.get("/profiles", getProfiles);

router.post("/login", loginValidation, validate, login);

export default router;
