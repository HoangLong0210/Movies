const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const pg = require("pg").Pool;

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
const pool = new Pool({
  user: "postgres",
  database: "Movies",
  password: "123",
  host: "localhost",
  port: "5432",
  max: 10,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to Database !");
  });
});

app.use(postTrimmer);

process.env.TZ = "Asia/Ho_Chi_Minh";

app.listen(port, () => console.log(`Listenning on port ${port}`));
