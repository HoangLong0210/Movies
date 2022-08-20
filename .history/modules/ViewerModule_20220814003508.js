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
