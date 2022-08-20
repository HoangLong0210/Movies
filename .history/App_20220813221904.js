const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const movie = require("./routes/MovieRouter");
const genre = require("./routes/GenreRouter");

require("dotenv").config();
//console.log(process.env);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("combined"));

function postTrimmer(req, res, next) {
  for (const [key, value] of Object.entries(req.body)) {
    if (typeof value === "string") req.body[key] = value.trim();
  }
  next();
}

app.use(postTrimmer);

process.env.TZ = "Asia/Ho_Chi_Minh";

app.use("/movie", movie);
app.use("/genre", genre);

app.listen(port, () => console.log(`Listenning on port ${port}`));
