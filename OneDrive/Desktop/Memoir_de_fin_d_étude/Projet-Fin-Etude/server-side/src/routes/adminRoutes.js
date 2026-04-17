const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const authMiddleware = require("../middlewares/authMiddleware");

const { getStats } = require("../controllers/adminControllers");
const { getBusinesses } = require("../controllers/adminControllers");
const { getUsers } = require("../controllers/adminControllers");
const { getReviews } = require("../controllers/adminControllers");
const { verifyBusiness } = require("../controllers/businessController");
const { deleteBusiness } = require("../controllers/businessController");

router.get("/stats", authMiddleware, isAdmin, getStats);
router.get("/businesses", authMiddleware, isAdmin, getBusinesses);
router.get("/users", authMiddleware, isAdmin, getUsers);
router.get("/reviews", authMiddleware, isAdmin, getReviews);
router.post("/verify-business/:id", authMiddleware, isAdmin, verifyBusiness);
router.delete("/reject-business/:id", authMiddleware, isAdmin, deleteBusiness);

module.exports = router;
