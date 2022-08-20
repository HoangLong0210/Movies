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
      'insert into "Genre" (service_type' +
      (service.cost ? ", cost" : "") +
      (service.timeuse ? ", timeuse" : "") +
      ") values ($1";
    if (service.cost) {
      query += ", $" + num;
      num += 1;
      params.push(service.cost);
    }
    if (service.timeuse) {
      query += ", $" + num;
      num += 1;
      params.push(service.timeuse);
    }

    query += ") returning *;";
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

service.update = (service, service_type) => {
  return new Promise((resolve, reject) => {
    let num = 1;
    let params = [];
    let query = `update "Service" set `;
    if (service.service_type) {
      if (num > 1) query += ",";
      query += ` service_type = $` + num;
      num += 1;
      params.push(genre.service_type);
    }
    if (genre.slug) {
      if (num > 1) query += ",";
      query += ` slug = $` + num;
      num += 1;
      params.push(genre.slug);
    }
    if (genre.title) {
      if (num > 1) query += ",";
      query += ` title = $` + num;
      num += 1;
      params.push(genre.title);
    }
    if (genre.description) {
      if (num > 1) query += ",";
      query += ` description = $` + num;
      num += 1;
      params.push(genre.description);
    }

    query += " where genre_id = $" + num + " returning *";
    params.push(genre_id);

    if (num == 1) query = 'select * from "Genre" where genre_id = $1 limit 1';

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

module.exports = service;
