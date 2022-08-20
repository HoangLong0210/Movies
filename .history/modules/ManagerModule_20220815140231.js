const conn = require("../Connection");

const manager = {};

manager.findAdminByAccount = ({ account_id }) => {
  return new Promise((resolve, reject) => {
    let query = `select admin_id, name, email, a.role_id, a.active
      from "Admin" u, "Account" a where u.account_id=a.account_id and a.account_id=$1`;

    let params = [account_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};
