const Review = require("../models/Review.js");
const Business = require("../models/Business");
const User = require("../models/User.js");
const Notification = require("../models/Notification.js");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary.js");
const { getIo, connectedUsers } = require("../config/socket.js");
const io = getIo();
const { ObjectId } = mongoose.Types;

const updateBusinessRating = async (businessId) => {
  try {
    const result = await Review.aggregate([
      { $match: { businessId: new ObjectId(businessId) } },
      {
        $group: {
          _id: "$businessId",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const newRating = result.length > 0 ? result[0].averageRating : 0;

    await Business.findByIdAndUpdate(businessId, { rating: newRating });
  } catch (error) {
    console.error(error);
  }
};

const getReviewsByBusinessId = async (req, res, next) => {
  const { id } = req.params;
  const { order } = req.query;
  try {
    const reviews = await Review.find({ businessId: id })
      .populate("userId", "avatar name")
      .sort({ createdAt: order === "desc" ? -1 : 1 });
    if (reviews) {
      return res.status(201).json({
        success: true,
        reviews,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No reviews found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const { sortBy } = req.query;

    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = -1;
    }

    const reviews = await Review.find()
      .populate({
        path: "userId",
        select: "avatar name",
      })
      .populate({
        path: "businessId",
        select: "_id, name",
      })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const getReview = async (req, res, next) => {
  const id = req.params.id;
  try {
    const review = await Review.findById(id).populate(
      "businessId",
      "name avatar location"
    );
    if (review) {
      return res.status(200).json({
        success: true,
        review,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const addReview = async (req, res, next) => {
  const { businessId, rating, comment } = req.body;

  try {
    let images = req.files?.images?.map((file) => file.path) || [];

    const review = await Review.create({
      userId: req.user.userId,
      businessId,
      rating,
      comment,
      images,
    });

    await updateBusinessRating(businessId);

    const business = await Business.findById(businessId);
    const reviewer = await User.findById(req.user.userId);
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    const ownerId = business.owner_id.toString();
    const ownerSocketId = connectedUsers.get(ownerId);

    const notification = await Notification.create({
      userId: ownerId,
      reviewer: reviewer._id,
      rating,
      businessId,
    });

    if (ownerSocketId) {
      io.to(ownerSocketId).emit("newReview", notification);
    } else {
    }

    return res.status(201).json({
      success: true,
      message: "Review added",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  const id = req.params.id;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const deleteImages = async (imageUrl) => {
      const parts = imageUrl.split("/");
      const publicId = parts.slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    };

    if (review.images && review.images.length > 0) {
      await Promise.all(review.images.map(deleteImages));
    }

    const businessId = review.businessId;
    await Review.findByIdAndDelete(id);

    await updateBusinessRating(businessId);

    return res.status(200).json({
      success: true,
      message: "Review and its images deleted successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  const id = req.params.id;
  const { businessId, rating, comment } = req.body;

  try {
    let oldImages = [];
    if (req.body.oldImages) {
      try {
        oldImages = JSON.parse(req.body.oldImages);
      } catch (error) {
        oldImages = [];
      }
    }

    const newImages = req.files?.images
      ? req.files.images.map((file) => file.path)
      : [];
    const updatedImages = [...oldImages, ...newImages];

    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const imagesToDelete = review.images.filter(
      (image) => !updatedImages.includes(image)
    );

    const deleteImages = async (imageUrl) => {
      console.log("1");

      const parts = imageUrl.split("/");
      console.log("2");

      const publicId = parts.slice(-2).join("/").split(".")[0];
      console.log(publicId);

      await cloudinary.uploader.destroy(publicId);
      console.log("1");
    };

    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map(deleteImages));
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        userId: req.user.userId,
        businessId,
        rating,
        comment,
        images: updatedImages,
      },
      { new: true, runValidators: true }
    );

    await updateBusinessRating(businessId);

    const business = await Business.findById(businessId);
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

const likeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (review.likes.includes(userId)) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
      review.dislikes.pull(userId);
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review liked successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const dislikeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (review.dislikes.includes(userId)) {
      review.dislikes.pull(userId);
    } else {
      review.dislikes.push(userId);
      review.likes.pull(userId);
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review disliked successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const replyToReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { replyText } = req.body;
    const userId = req.user.userId;

    const review = await Review.findById(reviewId).populate("businessId");
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (review.businessId.owner_id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only the business owner can reply to reviews",
      });
    }

    await Review.findByIdAndUpdate(
      reviewId,
      {
        ownerReply: {
          text: replyText,
          repliedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  deleteReview,
  updateReview,
  getReviews,
  getReview,
  getReviewsByBusinessId,
  likeReview,
  dislikeReview,
  replyToReview,
};
