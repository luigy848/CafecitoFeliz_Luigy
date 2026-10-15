import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import customerRoutes from "./customerRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import loyaltyRewardRoutes from "./loyaltyRewardRoutes.js";
import saleRoutes from "./saleRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use(userRoutes);
router.use(customerRoutes);
router.use(categoryRoutes);
router.use(productRoutes);
router.use(loyaltyRewardRoutes);
router.use(saleRoutes);

export default router;
