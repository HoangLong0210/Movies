const express = require("express");
const multer = require("multer");

const PersonController = require("../controllers/PersonController");

const router = express.Router();

router.get("/all", PersonController.getAll, PersonController.onGetResult);

router.get(
  "/detail/:movie_id",
  PersonController.getListPerson,
  PersonController.onGetResult
);

router.get(
  "/persondetail/:person_id",
  PersonController.getDetailPerson,
  PersonController.onGetResult
);

module.exports = router;
