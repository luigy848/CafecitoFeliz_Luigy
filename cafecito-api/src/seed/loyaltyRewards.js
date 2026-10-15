import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.conf.js";
import LoyaltyReward from "../models/LoyaltyReward.js";

dotenv.config();

const rewards = [
  {
    name: "Cliente frecuente",
    description: "7 visitas o mas en los ultimos 90 dias",
    minVisits: 7,
    percentage: 5,
    windowDays: 90,
  },
  {
    name: "Cliente fiel",
    description: "15 visitas o mas en los ultimos 90 dias",
    minVisits: 15,
    percentage: 10,
    windowDays: 90,
  },
  {
    name: "Cliente de casa",
    description: "30 visitas o mas en los ultimos 90 dias",
    minVisits: 30,
    percentage: 15,
    windowDays: 90,
  },
];

const seed = async () => {
  await connectDB();

  await LoyaltyReward.deleteMany({});
  console.log("Recompensas anteriores eliminadas");

  for (const reward of rewards) {
    const created = await LoyaltyReward.create(reward);
    console.log(
      "  " + created.name + ": " + created.minVisits + " visitas -> " + created.percentage + "%",
    );
  }

  await mongoose.disconnect();
  console.log("Listo");
};

seed();
