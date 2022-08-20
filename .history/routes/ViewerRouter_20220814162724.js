const express = require("express");
const multer = require("multer");

const ViewerController = require("../controllers/ViewerController");
const auth = require("../middleware/Auth");
const encrypt = require("../middleware/Encrypt");
