const conn = require("../Connection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const account = {};

account.findAccountByUsername = ({ username }) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where username=$1 and active=true`;

    let params = [username];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};
