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

genre.get_list_movie = (genre_id) => {
  return new Promise((resolve, reject) => {
    let params = [genre_id];
    let query = `select m.movie_id, m.slug, m.title, m.titleenglish, m.poster, m.description, m.releasemovie, m.nation, m.typeservice, m.url_trailer, m.rating, m.rate_count, m.search_number, m.view_number, m.typemovie, m.status_movie, G.genre_id, G.slug, G.title, G.description from "Movie" m inner join "MovieGenres" MG on m.movie_id = MG.movie_id inner join "Genre" G on MG.genre_id = G.genre_id where G.genre_id= $1 and m.typemovie='Phim lẻ'`;

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        console.log(res.rows);
        return resolve(res.rows);
      }
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
