const express = require("express");
const multer = require("multer");

const MovieController = require("../controllers/MovieController");
const slugify = require("../middleware/Slugify");
const auth = require("../middleware/Auth");
const { memoryStorage } = require("multer");
const router = express.Router();
const upload = multer({
  storage: memoryStorage(),
});

router.get("/all", MovieController.getAllMovie, MovieController.onGetResult);

router.get(
  "/suggest-movie",
  auth.verifyUser,
  MovieController.getSuggestMovie,
  MovieController.onGetResult
);

router.get(
  "/top-search",
  MovieController.getTopSearch,
  MovieController.onGetResult
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
  "/list/full",
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

router.post(
  "/",
  upload.fields([
    {
      name: "poster",
      maxCount: 1,
    },
  ]),
  auth.verifyAdmin,
  slugify.get_slug,
  MovieController.addMovie,
  MovieController.onGetResult
);

router.patch(
  "/:movie_id",
  upload.fields([
    {
      name: "poster",
      maxCount: 1,
    },
  ]),
  auth.verifyAdmin,
  slugify.get_slug,
  MovieController.updateMovie,
  MovieController.onGetResult
);

router.patch(
  "/rate/:movie_id",
  auth.verifyUser,
  MovieController.rateMovie,
  MovieController.onGetResult
);

module.exports = router;
