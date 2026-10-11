const isStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication is required" });
  }

  if (req.user.role !== "admin" && req.user.role !== "cashier") {
    return res.status(403).json({ message: "Staff access required" });
  }

  next();
};

export default isStaff;
