const { query } = require("express");
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

    conn.query(query, params, (err, res) => {
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
      console.log(num);
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
    let query = `select m.* from (select movie_id, count(movie_id) as count from (select * from "MovieGenres" where movie_id not in (select movie_id from "MovieFollows" where viewer_id = $1)) as mg where genre_id in (select genre_id from (select mg.genre_id as genre_id, count(genre_id) as count from (select "MovieFollows".movie_id from "MovieFollows" where viewer_id = $1) mf, "MovieGenres" mg where mf.movie_id = mg.movie_id group by movie_id order by count desc limit 10) as g) group by movie_id order by count desc limit 10) as sg, "Movie" m where m.movie_id = sg.movie_id`;
    let params = [viewer_id];
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

movie.get_top_search = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Movie" order by search_number desc limit 10`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

movie.get_top_rating = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Movie" order by rating desc limit 10`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

module.exports = movie;
