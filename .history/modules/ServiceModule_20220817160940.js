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

service.get_all = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Service"`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

service.add = (service) => {
  return new Promise((resolve, reject) => {
    let params = [service.service_type];
    let query =
      'insert into "Genre" (genre_id, title' +
      (service.cost ? ", cost" : "") +
      (service.timeuse ? ", timeuse" : "") +
      ") values ($1, $2";
  });
};

module.exports = service;
