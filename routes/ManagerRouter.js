const express = require("express");
const multer = require("multer");

const ManagerController = require("../controllers/ManagerController");
const auth = require("../middleware/Auth");
const encrypt = require("../middleware/Encrypt");
const { memoryStorage } = require("multer");
const pool = require("../Connection");

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post("/login", ManagerController.login, ManagerController.onGetResult);

module.exports = router;
