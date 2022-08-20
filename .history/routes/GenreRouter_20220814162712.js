const express = require("express");
const router = express.Router();
const GenreController = require("../controllers/GenreController");

const slugify = require("../middleware/Slugify");
const auth = require("../middleware/Auth");

router.get("/all", GenreController.getAllGenre, GenreController.onGetResult);

module.exports = router;
