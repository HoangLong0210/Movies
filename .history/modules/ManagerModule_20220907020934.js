const conn = require("../Connection");

const { isEmptyArray } = require("../configs/Helper");
const utils = require("../utils/utils");

const manager = {};

manager.find_manager_by_account = ({ account_id }) => {
  return new Promise((resolve, reject) => {
    let params = [account_id];
    let query = `select m.manager_id, name, email, avatar, phone, address, gender a.role_id, a.status from "Manager" m inner join "Account" a on m.account_id = a.account_id where a.account_id= $1`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

manager.login = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" a where a.username=$1 and a.password=$2 and a.status<>-1`;
    let params = [username, password];

    conn.query(query, params, (err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        if (isEmptyArray(res.rows)) {
          return resolve(null);
        } else {
          return resolve(res.rows[0]);
        }
      }
    });
  });
};

module.exports = manager;
