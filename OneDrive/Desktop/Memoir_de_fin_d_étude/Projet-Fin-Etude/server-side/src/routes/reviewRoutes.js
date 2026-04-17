const {
  addReview,
  deleteReview,
  updateReview,
  getReviews,
  getReview,
  getReviewsByBusinessId,
  likeReview,
  dislikeReview,
  replyToReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const express = require("express");
const router = express.Router();

router.get("/:id", getReview);
router.get("/businessReviews/:id", getReviewsByBusinessId);
router.get("/", getReviews);
router.put("/:id", authMiddleware, upload, updateReview);
router.post("/", authMiddleware, upload, addReview);
router.delete("/:id", authMiddleware, deleteReview);
router.put("/:reviewId/like", authMiddleware, likeReview);
router.put("/:reviewId/dislike", authMiddleware, dislikeReview);
router.put("/:reviewId/reply", authMiddleware, replyToReview);

module.exports = router;
