import mongoose from "mongoose";
import Sale from "../models/Sale.js";
import LoyaltyReward from "../models/LoyaltyReward.js";

const DEFAULT_WINDOW_DAYS = 90;

const roundMoney = (amount) => Math.round(amount * 100) / 100;

const countVisits = async (customerId, windowDays = DEFAULT_WINDOW_DAYS) => {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  const result = await Sale.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(customerId),
        paymentStatus: "paid",
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
      },
    },
    { $count: "visits" },
  ]);

  return result.length > 0 ? result[0].visits : 0;
};

const findBestReward = async (customerId) => {
  const rewards = await LoyaltyReward.find({ active: true }).sort({
    percentage: -1,
  });

  for (const reward of rewards) {
    const visits = await countVisits(customerId, reward.windowDays);
    if (visits >= reward.minVisits) {
      return { reward, visits };
    }
  }

  return { reward: null, visits: await countVisits(customerId) };
};

const calculateDiscount = async (customerId, subtotal) => {
  const { reward, visits } = await findBestReward(customerId);

  if (!reward) {
    return {
      visits,
      discount: { reward: null, name: null, percentage: 0, amount: 0 },
    };
  }

  return {
    visits,
    discount: {
      reward: reward._id,
      name: reward.name,
      percentage: reward.percentage,
      amount: roundMoney((subtotal * reward.percentage) / 100),
    },
  };
};

const getBenefits = async (customerId) => {
  const { reward, visits } = await findBestReward(customerId);

  const nextReward = await LoyaltyReward.findOne({
    active: true,
    minVisits: { $gt: reward ? reward.minVisits : 0 },
  }).sort({ minVisits: 1 });

  return {
    visits,
    currentReward: reward
      ? { name: reward.name, percentage: reward.percentage }
      : null,
    nextReward: nextReward
      ? {
          name: nextReward.name,
          percentage: nextReward.percentage,
          minVisits: nextReward.minVisits,
          visitsToGo: Math.max(nextReward.minVisits - visits, 0),
        }
      : null,
  };
};

export {
  roundMoney,
  countVisits,
  findBestReward,
  calculateDiscount,
  getBenefits,
};
