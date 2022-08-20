const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pg = require("pg");

require("dotenv").config();
//console.log(process.env);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function postTrimmer(req, res, next) {
  for (const [key, value] of Object.entries(req.body)) {
    if (typeof value === "string") req.body[key] = value.trim();
  }
  next();
}

app.use(postTrimmer);

process.env.TZ = "Asia/Ho_Chi_Minh";

app.listen(port, () => console.log(`Listenning on port ${port}`));
