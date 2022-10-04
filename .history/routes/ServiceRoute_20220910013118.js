const express = require("express");
const multer = require("multer");

const ServiceController = require("../controllers/ServiceController");

const router = express.Router();

router.get("/all", ServiceController.getAll, ServiceController.onGetResult);

router.get(
  "/:service_id",
  ServiceController.getDetail,
  ServiceController.onGetResult
);

module.exports = router;
