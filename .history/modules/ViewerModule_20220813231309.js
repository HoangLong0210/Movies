const bcrypt = require("bcrypt");
const conn = require("../Connection");
const jwt = require("jsonwebtoken");

const viewer = {};

viewer.get_viewer_info = (viewer_id) => {
  return new Promise((resolve, reject) => {
    let query = `select u.user_id, name, avatar, phone, email, address, rating, a.role_id, a.active
    from "Customer" u, "Account" a where u.account_id=a.account_id and user_id=$1`;

    let params = [user_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};
