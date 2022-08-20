const constants = require("../configs/Constants");
const conn = require("../Connection");

const movie = {};

movie.get_all_movie = (page) => {
  return new Promise((resolve, reject) => {
    let params = [];
    let query = `select * from "Movie"`;
    query +=
      " where limit " +
      constants.limit_element +
      " offset " +
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
    let query = `select m.* from "Movie" m, (select movie_id count(movie_id) as count from "MovieGenres" where genre_id = any($1:: []) group by movie_id) as mg where m.movie_id = mg.movie_id`;
    if (filter.title) {
      query += ` and title ilike $` + num;
      num += 1;
      params.push("%" + filter.title + "%");
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
      query += ` where title ilike $` + num;
      num += 1;
      params.push("%" + filter.title + "%");
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
    let query = `select b.* from
    (select book_endpoint, count(book_endpoint) as count from
    (select * from "BookGenres" where book_endpoint not in
    (select book_endpoint from "BookFollows" where username = $1)) as bg where genre_endpoint in
    (select genre_endpoint from (select bg.genre_endpoint as genre_endpoint, count(genre_endpoint) as count from
    (select book_endpoint from "BookFollows" where username = $1) bf,
    "BookGenres" bg where bf.book_endpoint = bg.book_endpoint
    group by genre_endpoint
    order by count desc limit 10) as g)
    group by book_endpoint
    order by count desc limit 10) as sg, "Book" b
    where b.endpoint = sg.book_endpoint`;
  });
};

module.exports = movie;
