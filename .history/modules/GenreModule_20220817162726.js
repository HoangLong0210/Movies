const conn = require("../Connection");

const genre = {};

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

genre.get_all = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Genre"`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

genre.add = (genre) => {
  return new Promise((resolve, reject) => {
    let params = [genre.genre_id, genre.title];
    let query =
      'insert into "Genre" (genre_id, title' +
      (genre.slug ? ", slug" : "") +
      (genre.description ? ", description" : "") +
      ") values ($1, $2";

    if (genre.slug) {
      query += ", $" + num;
      num += 1;
      params.push(genre.slug);
    }
    if (genre.description) {
      query += ", $" + num;
      num += 1;
      params.push(genre.description);
    }

    query += ") returning *;";

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

genre.update = (genre, genre_id) => {
  return new Promise((resolve, reject) => {
    let num = 1;
    let params = [];
    let query = `update "Genre" set `;
    if (genre.genre_id) {
      if (num > 1) query += ",";
      query += ` genre_id = $` + num;
      num += 1;
      params.push(genre.genre_id);
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

module.exports = genre;
