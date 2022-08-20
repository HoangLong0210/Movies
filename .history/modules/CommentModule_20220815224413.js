const conn = require("../Connection");

const constants = require("../configs/Constants");
const { movie } = require("../configs/Message");

const comment = {};

comment.get = (id, page) => {
  return new Promise((resolve, reject) => {
    let query = `select id, v.avatar, v.name, v.email, v.viewer_id, v.address, v.phone, movie_id, id_root, content, files, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Comment" c, "Viewers" v where (id = $1 or id_root = $1) and c.viewer_id = v.viewer_id order by id desc`;
    query +=
      " limit " +
      constants.limit_element +
      " offset " +
      constants.limit_element * (page - 1);
    let params = [id];
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

db.get_all = (movie_id, page) => {
  return new Promise((resolve, reject) => {
    let query = `select id, v.avatar, v.name, v.email, v.viewer_id, v.address, v.phone, movie_id, id_root, content, files, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Comment" c, "Viewers" v where movie_id = $1 and id_root = id and c.viewer_id = v.viewer_id  order by id desc`;
    query +=
      " limit " +
      constants.limit_element +
      " offset " +
      constants.limit_element * (page - 1);
    let params = [movie_id];
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

comment.add = (comment) => {
  return new Promise((resolve, reject) => {
    let num = 4;
    let params = [comment.movie_id, comment.viewer_id, comment.content];
    let query =
      'insert into "Comment" (book_endpoint, username, content' +
      (comment.id_root ? ", id_root" : "") +
      (comment.files ? ", files" : "") +
      ") values ($1, $2, $3";

    if (comment.id_root) {
      if (num > 1) query += ", $" + num;
      num += 1;
      params.push(comment.id_root);
    }
    if (comment.files) {
      if (num > 1) query += ", $" + num;
      num += 1;
      params.push(comment.files);
    }
    query += `) returning id, id_root, book_endpoint, content, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time, files`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};
