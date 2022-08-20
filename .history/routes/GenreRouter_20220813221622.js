const express = require("express");
const router = express.Router();
const GenreController = require("../controllers/GenreController");

const slugify = require("../middleware/slugify");
