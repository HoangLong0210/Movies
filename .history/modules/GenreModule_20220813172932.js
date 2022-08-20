const conn = require("../Connection");

const genre = {};

genre.get = (genre_id) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Genre" where genre_id = $1 limit 1`;
    let params = [genre_id];
    conn.query(query, (err, res) => {
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
    let query =
      'insert into "Genre" (genre_id, title' +
      (genre.slug ? ", slug" : "") +
      (genre.description ? ", description" : "") +
      ") values ($1, $2";

    let params = [genre.genre_id, genre.title];
    if (genre.slug) {
      query += ", $" + num;
      num += 1;
      params.push(genre.slug);
    }
  });
};
