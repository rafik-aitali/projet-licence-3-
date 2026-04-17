const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const Business = require("../models/Business");
const Review = require("../models/Review");
const bycrypt = require("bcryptjs");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    if (users) {
      return res.status(201).json({
        success: true,
        users,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }
  } catch (error) {
    next(error);
  }
};
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (user) {
      return res.status(201).json({
        success: true,
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bycrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        email,
        password: hashedPassword,
      },
      { new: true, runValidators: true }
    );
    if (user) {
      return res.status(201).json({
        success: true,
        message: "user updated",
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "failed to update user",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    user.avatar = req.files.avatar[0].path;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      newAvatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "failed to delete user",
      });
    }

    const deleteImages = async (imageUrl) => {
      const parts = imageUrl.split("/");
      const publicId = parts.slice(-2).join("/").split(".")[0];
      return await cloudinary.uploader.destroy(publicId);
    };

    if (
      user.avatar !==
      "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
    ) {
      await deleteImages(user.avatar);
    }

    const businesses = await Business.find({ owner_id: id });
    for (const business of businesses) {
      for (const image of business.images) {
        await deleteImages(image);
      }
      const reviews = await Review.find({ businessId: business._id });
      for (const review of reviews) {
        for (const image of review.images) {
          await deleteImages(image);
        }
      }
      await Review.deleteMany({ businessId: business._id });
      await Business.findByIdAndDelete(business._id);
    }

    const deleteUser = await User.findByIdAndDelete(id);
    if (deleteUser) {
      return res.status(200).json({
        success: true,
        message: "user and their businesses and reviews deleted",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getUserBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ owner_id: req.user.userId });
    if (businesses) {
      return res.status(200).json({
        success: true,
        data: businesses,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "user doesn't have any business",
      });
    }
  } catch (error) {
    next(error);
  }
};

const saveBusiness = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { businessId } = req.body;

    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, message: "Business ID is required" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedBusinesses: businessId } },
      { new: true }
    ).populate("savedBusinesses");

    res.status(200).json({
      success: true,
      message: "Business saved successfully",
      savedBusinesses: user.savedBusinesses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unsaveBusiness = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { businessId } = req.body;

    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, message: "Business ID is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedBusinesses: businessId } },
      { new: true }
    ).populate("savedBusinesses");

    res.status(200).json({
      success: true,
      message: "Business removed from saved list",
      savedBusinesses: user.savedBusinesses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSavedBusinesses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("savedBusinesses");

    res.status(200).json({
      success: true,
      savedBusinesses: user.savedBusinesses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserBusinesses,
  updateUserAvatar,
  saveBusiness,
  unsaveBusiness,
  getSavedBusinesses,
};
