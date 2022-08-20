const conn = require("../Connection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const account = {};

account.findAccountByUsername = ({ username }) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where username=$1 and status <> -1`;

    let params = [username];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

account.findAccountByAccountID = ({ account_id }) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where account_id=$1 and status<>-1`;

    let params = [account_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

account.lockAccount = ({ account_id }) => {
  return new Promise((resolve, reject) => {
    let query = `update "Account" set status=-1, where account_id=$1 returning *`;

    let params = [account_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};
