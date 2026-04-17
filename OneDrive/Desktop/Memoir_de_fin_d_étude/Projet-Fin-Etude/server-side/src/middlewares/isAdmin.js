const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    console.log(req.user);

    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = isAdmin;
