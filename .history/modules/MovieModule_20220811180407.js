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
      query += ` and title ilike $` + num;
      num += 1;
      params.push("%" + filter.title, "%");
    }
    if (filter.author) {
      query += ` and lower(author) = lower($` + num + `)`;
      num += 1;
      params.push(filter.author);
    }
    query += ` and count >= $2
        order by count desc`;
    query +=
      " limit " +
      constants.limit_element +
      " offset " +
      constants.limit_element * (page - 1);

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  });
};

movie.filter_without_genres = (filter, page) => {
  return new Promise((resolve, reject) => {
    let num = 1;
    let params = [];
    let query = `select * from "Movie"`;

    if (filter.title) {
      query += `where title ilike $` + num;
      num += 1;
      params.push("%" + filter.title + "%");
    }
    if (filter.author) {
      query += `where lower(author) = lower($` + num + `)`;
      num += 1;
      params.push(filter.author);
    }
    query +=
      " limit " +
      constants.limit_element +
      " offset " +
      constants.limit_element * (page - 1);

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  });
};

movie.get_suggest_movie = (viewer_id) => {
  return new Promise((resolve, reject) => {
    let query = `select m.* from
    (select movie_id, count(movie_id) as count from
    (select * from "MovieGenres" where movie_id not in
    (select movie_id from "MovieFollows" where viewer_id = $1)) as mg where genre_id in
    (select genre_id from (select mg.genre_id as genre_id, count(genre_id) as count from
    (select movie_id from "MovieFollows" where viewer_id = $1) mf,
    "MovieGenres" mg where mf.movie_id = mg.movie_id
    group by genre_id
    order by count desc limit 10) as g)
    group by movie_id
    order by count desc limit 10) as sg, "Movie" m
    where m.movie_id = sg.movie_id`;
  });
};

module.exports = movie;
