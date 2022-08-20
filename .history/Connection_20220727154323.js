const Pool = require("pg").Pool;

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
