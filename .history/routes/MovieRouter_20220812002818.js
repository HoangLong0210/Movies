const express = require("express");
const multer = require("multer");

const MovieController = require("../controllers/MovieController");
const slugify = require("../middleware/slugify");

const { memoryStorage } = require("multer");
const router = express.Router();
const upload = multer({
  storage: memoryStorage(),
});

router.get("/all", MovieController.getAllMovie, MovieController.onGetResult);
//router.get('/suggest-movie',)

module.exports = router;
