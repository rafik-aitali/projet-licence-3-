const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const isAdmin = require("../middlewares/isAdmin");

const {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getUnverifiedBusinesses,
} = require("../controllers/businessController");

const router = express.Router();

router.get("/", getBusinesses);

router.get("/:id", getBusinessById);

router.post("/", authMiddleware, upload, createBusiness);

router.put("/:id", authMiddleware, upload, updateBusiness);

router.delete("/:id", authMiddleware, deleteBusiness);

router.get("/unverified", authMiddleware, isAdmin, getUnverifiedBusinesses);

// router.put("/ban-user/:id", authMiddleware, isAdmin, banUser);

module.exports = router;
