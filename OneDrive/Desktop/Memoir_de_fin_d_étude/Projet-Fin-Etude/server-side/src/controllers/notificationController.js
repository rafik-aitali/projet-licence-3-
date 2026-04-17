const Notification = require("../models/Notification");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userId,
    })
      .populate({
        path: "businessId",
        select: "name avatar",
      })
      .populate({
        path: "reviewer",
        select: "name",
      });
    return res.status(201).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  const id = req.params.id;
  try {
    const notification = await Notification.findByIdAndDelete(id);
    return res
      .status(201)
      .json({ success: true, message: "notification deleted" });
  } catch (error) {
    next(error);
  }
};

const markNotificationsAsRead = async (req, res, next) => {
  try {
    const notifications = await Notification.updateMany(
      { userId: req.user.userId, isRead: false },
      { isRead: true }
    );
    if (notifications) {
      return res.status(201).json({
        success: true,
        message: "Notifications marked as read",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getNotifications,
  deleteNotification,
  markNotificationsAsRead,
};
