const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const categoriesPath = path.join(__dirname, "../data/categories.json");
const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));

router.get("/", (req, res, next) => {
  res.json(categories);
});

module.exports = router;
