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

viewer.createAccount = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Account" (username, password, role_id) values ($1, $2, $3) returning account_id`;

    let params = [username, password, "viewer"];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows.length > 0 ? res.rows[0] : {});
    });
  });
};

viewer.createViewer = ({ account_id, phone }) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Viewers" (viewer_id, account_id, phone) values ($1, $2, $3)`;
    let viewer_id = uuidv4();
    let params = [viewer_id, account_id, phone];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve([]);
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

viewer.unfollow_movie = (movie_id, viewer_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id, viewer_id];
    let query =
      'delete from "MovieFollows" where movie_id = $1 and viewer_id = $2 returning *';
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

viewer.get_movie_following = (viewer_id) => {
  return new Promise((resolve, reject) => {
    let params = [viewer_id];
    let query = `select id, v.viewer_id, v.name, v.avatar, v.email,v.phone,v.address, movie_id, id_root, content, files, to_char(time, 'DD-MM-YYYY hh:mm:ss')
    as time from "Comment" c, "Viewers" v where c.viewer_id = $1 and c.viewer_id = v.viewer_id order by id desc`;
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

module.exports = viewer;
