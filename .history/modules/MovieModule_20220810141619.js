const conn = require("../Connection");
const constants = require("../configs/Constants");

const movie = {};

movie.get_all_movie = () => {
  return new Promise((resolve, reject) => {
    let param = [];
    let query = `Select * from "Movie"`;
    query +=
      "limit" +
      constants.limit_element +
      "offset" +
      constants.limit_element * (page - 1);

    conn.query(query, param, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  });
};

movie.filter_with_genres = (filter, page) => {
  return new Promise((resolve, reject) => {
    let num = 3;
    let params = [filter.genres, filter.genres.length];
    let query = `select m.* from "Movie" m, (select movie_id, count(movie_id) as count from "MovieGenres" where genre_id = any($1:: []) group by movie_id) as mg where m.movie_id = mg.movie_id`;
    if (filter.title) {
    }
  });
};
