const {
  getNotifications,
  deleteNotification,
  markNotificationsAsRead,
} = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.delete("/:id", authMiddleware, deleteNotification);
router.put("/mark-as-read", authMiddleware, markNotificationsAsRead);

module.exports = router;
