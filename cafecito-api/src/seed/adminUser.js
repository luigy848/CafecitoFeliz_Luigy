import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "../config/db.conf.js";
import User from "../models/User.js";

dotenv.config();

const profiles = [
  {
    name: "Administrador",
    username: "admin",
    password: process.env.SEED_ADMIN_PASSWORD || "admin123",
    role: "admin",
  },
  {
    name: "Caja",
    username: "caja",
    password: process.env.SEED_CASHIER_PASSWORD || "caja123",
    role: "cashier",
  },
];

const seed = async () => {
  await connectDB();

  for (const profile of profiles) {
    const exists = await User.findOne({ username: profile.username });

    if (exists) {
      console.log("Ya existia:", profile.username);
      continue;
    }

    const hashPassword = await bcrypt.hash(profile.password, 10);
    await User.create({
      name: profile.name,
      username: profile.username,
      password: hashPassword,
      role: profile.role,
    });
    console.log(
      "Creado:",
      profile.username,
      "/",
      profile.password,
      "(" + profile.role + ")",
    );
  }

  await mongoose.disconnect();
  console.log("Listo");
};

seed();
