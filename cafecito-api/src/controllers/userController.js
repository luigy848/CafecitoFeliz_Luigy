import User from "../models/User.js";
import { generatePassword } from "./authController.js";

const slugify = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const generateUsername = async (name) => {
  const base = slugify(name) || "perfil";
  let candidate = base;
  let counter = 2;

  while (await User.findOne({ username: candidate })) {
    candidate = base + "-" + counter;
    counter += 1;
  }

  return candidate;
};

const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;

    const filters = {};
    if (role) filters.role = role;

    const users = await User.find(filters).select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, password, role } = req.body;

    const username = await generateUsername(name);

    const hashPassword = await generatePassword(password);

    const newUser = await User.create({
      name,
      username,
      password: hashPassword,
      role,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, password, role, active } = req.body;

    if (req.user.role !== "admin" && req.user.userId !== id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own account" });
    }

    const updates = { name };
    if (password) updates.password = await generatePassword(password);
    if (req.user.role === "admin") {
      if (role) updates.role = role;
      if (active !== undefined) updates.active = active;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { getUsers, getUserById, getMe, createUser, updateUser, deactivateUser };
