import LoyaltyReward from "../models/LoyaltyReward.js";

const getLoyaltyRewards = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;

    const filters = {};
    if (includeInactive !== "true") filters.active = true;

    const rewards = await LoyaltyReward.find(filters).sort({ minVisits: 1 });
    res.status(200).json(rewards);
  } catch (error) {
    next(error);
  }
};

const getLoyaltyRewardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reward = await LoyaltyReward.findById(id);

    if (!reward) {
      return res.status(404).json({ message: "Loyalty reward not found" });
    }

    res.status(200).json(reward);
  } catch (error) {
    next(error);
  }
};

const createLoyaltyReward = async (req, res, next) => {
  try {
    const { name, description, minVisits, percentage, windowDays, active } =
      req.body;

    const newReward = await LoyaltyReward.create({
      name,
      description,
      minVisits,
      percentage,
      windowDays,
      active,
    });

    res.status(201).json(newReward);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "A loyalty reward with that name already exists" });
    }
    next(error);
  }
};

const updateLoyaltyReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, minVisits, percentage, windowDays, active } =
      req.body;

    const updatedReward = await LoyaltyReward.findByIdAndUpdate(
      id,
      { name, description, minVisits, percentage, windowDays, active },
      { new: true, runValidators: true },
    );

    if (!updatedReward) {
      return res.status(404).json({ message: "Loyalty reward not found" });
    }

    res.status(200).json(updatedReward);
  } catch (error) {
    next(error);
  }
};

const deleteLoyaltyReward = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reward = await LoyaltyReward.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );

    if (!reward) {
      return res.status(404).json({ message: "Loyalty reward not found" });
    }

    res.status(200).json(reward);
  } catch (error) {
    next(error);
  }
};

export {
  getLoyaltyRewards,
  getLoyaltyRewardById,
  createLoyaltyReward,
  updateLoyaltyReward,
  deleteLoyaltyReward,
};
