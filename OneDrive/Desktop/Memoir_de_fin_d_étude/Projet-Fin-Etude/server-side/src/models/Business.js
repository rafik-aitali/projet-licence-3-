const mongoose = require("mongoose");
const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    subcategory: {
      type: String,
      required: [true, "subcategory is required"],
    },
    description: {
      type: String,
      default: "No description provided",
    },
    location: {
      address: { type: String, required: true },
      state: { type: String, required: true },
      coordinates: {
        type: [Number],
        validate: {
          validator: (val) =>
            val.length === 2 && val.every((num) => typeof num === "number"),
          message:
            "Coordinates must be an array of two numbers [latitude, longitude]",
        },
      },
    },
    contact: {
      phone: { type: String },
      website: { type: String },
      email: { type: String },
    },
    images: {
      type: [String],
    },
    avatar: {
      type: [String],
      default:
        "https://res.cloudinary.com/dqucrn5s7/image/upload/v1741271324/avatars/cy9vway6ytyokt32s0kf.jpg",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
