const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const businessRoutes = require("./businessRoutes");
const reviewRoutes = require("./reviewRoutes");
const notificationRoutes = require("./notificationRoutes");
const categoryRoutes = require("./categoryRoutes");
const adminRoutes = require("./adminRoutes");

const express = require("express");
const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/notifications", notificationRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/businesses", businessRoutes);
router.use("/reviews", reviewRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
