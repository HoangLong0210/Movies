const bcrypt = require("bcrypt");
const conn = require("../Connection");
const jwt = require("jsonwebtoken");

const viewer = {};

viewer.get_viewer_info = (viewer_id) => {
  return new Promise((resolve, reject) => {
    let query = `select v.viewer_id, name, avatar, email, phone, address, a.role_id from "Viewers" v, "Account" a where v.account_id=a.account_id and viewer_id=$1`;

    let params = [viewer_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

viewer.follow_movie = (movie_id, viewer_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id, viewer_id];
    let query = 'insert into "MovieFollows" values($1,$2) returning *';
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};
