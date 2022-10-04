const express = require("express");
const multer = require("multer");

const EpisodeController = require("../controllers/EpisodeController");

const router = express.Router();

router.get("/all", EpisodeController.getAll, EpisodeController.onGetResult);

router.get(
  "/detail/:movie_id",
  EpisodeController.getAllMovie,
  EpisodeController.onGetResult
);

router.get(
  "/detail/:movie_id/:episode_movie",
  EpisodeController.getDetailEpisode,
  EpisodeController.onGetResult
);

module.exports = router;
