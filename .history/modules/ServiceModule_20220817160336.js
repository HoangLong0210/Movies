const constants = require("../configs/Constants");
const conn = require("../Connection");

const service = {};

service.get = (service_type) => {
  return new Promise((resolve, reject) => {
    let params = [service_type];
    let query = `select * from "Service" where service_type = $1 limit 1`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

genre.get = (genre_id) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Genre" where genre_id = $1 limit 1`;
    let params = [genre_id];
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};
