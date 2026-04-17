const {
  getUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  saveBusiness,
  getUserBusinesses,
  unsaveBusiness,
  updateUserAvatar,
  getSavedBusinesses,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const express = require("express");
const router = express.Router();
router.get("/", authMiddleware, isAdmin, getUsers);
router.post("/upload-avatar", authMiddleware, upload, updateUserAvatar);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/:id", authMiddleware, deleteUser);
router.get("/businesses", authMiddleware, getUserBusinesses);
router.post("/save-business", authMiddleware, saveBusiness);
router.post("/unsave-business", authMiddleware, unsaveBusiness);
router.get("/saved-businesses", authMiddleware, getSavedBusinesses);
module.exports = router;
