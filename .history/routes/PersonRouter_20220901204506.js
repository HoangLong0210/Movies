const express = require("express");
const multer = require("multer");

const PersonController = require("../controllers/PersonController");

const router = express.Router();

router.get(
  "/all",
  PersonController.getListPerson,
  PersonController.onGetResult
);
