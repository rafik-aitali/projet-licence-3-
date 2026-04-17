const User = require("../models/User");
const Business = require("../models/Business");
const Review = require("../models/Review");

const getStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalUsers = await User.countDocuments();
    const usersToday = await User.countDocuments({
      createdAt: { $gte: startOfDay },
    });
    const usersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalBusinesses = await Business.countDocuments();
    const businessesToday = await Business.countDocuments({
      createdAt: { $gte: startOfDay },
    });
    const businessesThisMonth = await Business.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalReviews = await Review.countDocuments();
    const reviewsToday = await Review.countDocuments({
      createdAt: { $gte: startOfDay },
    });
    const reviewsThisMonth = await Review.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          today: usersToday,
          thisMonth: usersThisMonth,
        },
        businesses: {
          total: totalBusinesses,
          today: businessesToday,
          thisMonth: businessesThisMonth,
        },
        reviews: {
          total: totalReviews,
          today: reviewsToday,
          thisMonth: reviewsThisMonth,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const getBusinesses = async (req, res, next) => {
  try {
    const {
      search,
      verified,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    if (verified === "true") {
      filter.isVerified = true;
    } else if (verified === "false") {
      filter.isVerified = false;
    }

    const sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };

    const businesses = await Business.find(filter)
      .populate("owner_id", "name")
      .sort(sortOptions);

    res.status(200).json({ success: true, businesses });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { search, filter, sortBy = "createdAt", order = "desc" } = req.query;
    const filterConditions = {};

    if (search) {
      filterConditions.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (filter === "today") {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      filterConditions.createdAt = { $gte: startOfDay };
    } else if (filter === "thisMonth") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      filterConditions.createdAt = { $gte: startOfMonth };
    }

    const sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };

    const users = await User.find(filterConditions).sort(sortOptions);

    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
const getReviews = async (req, res, next) => {
  try {
    const { search, filter, sortBy = "createdAt", order = "desc" } = req.query;
    const filterConditions = {};

    if (search) {
      filterConditions.$or = [
        { comment: { $regex: search, $options: "i" } },
        { "userId.name": { $regex: search, $options: "i" } },
        { "userId.email": { $regex: search, $options: "i" } },
        { "businessId.name": { $regex: search, $options: "i" } },
      ];
    }

    if (filter === "today") {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      filterConditions.createdAt = { $gte: startOfDay };
    } else if (filter === "thisMonth") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      filterConditions.createdAt = { $gte: startOfMonth };
    }

    const sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };

    const reviews = await Review.find(filterConditions)
      .populate("userId", "name email")
      .populate("businessId", "name")
      .sort(sortOptions);

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getBusinesses, getUsers, getReviews };
