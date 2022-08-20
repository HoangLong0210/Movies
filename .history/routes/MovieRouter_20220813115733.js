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
router.get(
  "/top-search",
  MovieController.getTopSearch,
  MovieController.onGetResult;
);

router.get(
  "/top-rating",
  MovieController.getTopRating,
  MovieController.onGetResult
);

router.get(
  "/top-follow",
  MovieController.getTopFollow,
  MovieController.onGetResult
);

router.get(
  "/relate-movie/:movie_id",
  MovieController.getRelateMovie,
  MovieController.onGetResult
);

router.get(
  "/detail/:movie_id",
  MovieController.getDetailMovie,
  MovieController.onGetResult
);

module.exports = router;
