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

conn = new pg.Pool(db_config);

conn.connect((err, client, done) => {
  if (err) {
    log.error(err.message);
    log.error(`could not connect to database`);
  } else {
    conn.query("SELECT 1", (err, res) => {
      done();
      if (err) {
        log.error(err);
      } else {
        log.info("connected to database");
      }
    });
  }
});

app.use(postTrimmer);

process.env.TZ = "Asia/Ho_Chi_Minh";

app.listen(port, () => console.log(`Listenning on port ${port}`));
