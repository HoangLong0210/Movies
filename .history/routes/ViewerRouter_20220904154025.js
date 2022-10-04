const express = require("express");
const multer = require("multer");

const ViewerController = require("../controllers/ViewerController");
const auth = require("../middleware/Auth");
const encrypt = require("../middleware/Encrypt");
const { memoryStorage } = require("multer");

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.get(
  '/info/":viewer_id',
  ViewerController.get,
  ViewerController.onGetResult
);

router.get(
  "/movie-following",
  auth.verifyUser,
  ViewerController.getMovieFollowing,
  ViewerController.onGetResult
);

router.get(
  "/comment-history/:viewer_id",
  auth.verifyAdmin,
  ViewerController.getCommentHistory,
  ViewerController.onGetResult
);

router.post(
  "/follow-movie/movie_id",
  auth.verifyUser,
  ViewerController.followMovie,
  ViewerController.onGetResult
);

router.post(
  "/unfollow-movie/:movie_id",
  auth.verifyUser,
  ViewerController.unfollowMovie,
  ViewerController.onGetResult
);

router.post("/login", ViewerController.login);

module.exports = router;
