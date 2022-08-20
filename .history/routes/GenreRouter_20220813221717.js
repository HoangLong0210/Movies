const express = require("express");
const router = express.Router();
const GenreController = require("../controllers/GenreController");

const slugify = require("../middleware/slugify");
const auth = require("../middleware/auth");

router.get("/all", GenreController.getAllGenre, GenreController.onGetResult);
