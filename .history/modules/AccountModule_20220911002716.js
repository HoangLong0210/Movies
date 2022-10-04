const conn = require("../Connection");

const account = {};

account.find_account_by_username = ({ username }) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where username=$1 and status <> -1`;

    let params = [username];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

account.find_account_by_accountID = ({ account_id }) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where account_id=$1 and status<>-1`;

    let params = [account_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

account.lock_account = ({ account_id }) => {
  return new Promise((resolve, reject) => {
    let query = `update "Account" set status=-1 where account_id=$1 returning *`;

    let params = [account_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

module.exports = account;
