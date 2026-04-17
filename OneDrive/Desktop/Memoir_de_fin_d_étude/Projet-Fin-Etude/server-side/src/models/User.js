const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "business_owner", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png",
    },
    savedBusinesses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
