const conn = require("../Connection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { isEmptyArray } = require("../configs/Helper");
const utils = require("../utils/utils");

const viewer = {};

viewer.get_viewer_info = (viewer_id) => {
  return new Promise((resolve, reject) => {
    let query = `select v.viewer_id, name, avatar, email, phone, address, a.status, a.role_id from "Viewers" v, "Account" a where v.account_id=a.account_id and viewer_id=$1`;

    let params = [viewer_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

viewer.find_viewer_by_account = (account_id) => {
  return new Promise((resolve, reject) => {
    let params = [account_id];
    let query = `select V.viewer_id, name, avatar, phone, email, address, gender, a.role_id, a.status from "Viewers" V inner join "Account" A on V.account_id = A.account_id where  A.account_id = $1`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

viewer.find_account_by_viewer = ({ username }) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where username = $1 and role_id = 2 and status<>-1`;

    let params = [username];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

viewer.is_valid_access_token = ({ account_id, access_token }) => {
  return new Promise((resolve, reject) => {
    let query = `select 1 as exist from "Account" where account_id=$1 and  $2 = ANY (access_tokens::varchar[])`;

    let params = [account_id, access_token];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

viewer.create_account = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Account" (username, password, role_id) values ($1, $2, $3) returning account_id`;

    let params = [username, password, 2];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows.length > 0 ? res.rows[0] : {});
    });
  });
};

viewer.create_viewer = ({ account_id, phone }) => {
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

viewer.update_info = ({ viewer_id, name, avatar, email, address }) => {
  return new Promise((resolve, reject) => {
    let num = 1;
    let params = [];

    let query = `update "Viewers" set `;
    if (name) {
      query += ` name=$${num++},`;
      params.push(name);
    }
    if (avatar) {
      query += ` avatar=$${num++},`;
      params.push(avatar);
    }
    if (email) {
      query += ` email=$${num++},`;
      params.push(email);
    }
    if (address) {
      query += ` address=$${num++},`;
      params.push(address);
    }

    if (query.endsWith(" ")) {
      return resolve(null);
    } else {
      query = utils.removeCharAt(query, query.length - 1);
    }

    query += ` where viewer_id=$${num} returning viewer_id, name, avatar, phone, email, address`;
    params.push(viewer_id);

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(res.rows[0]);
      }
    });
  });
};

viewer.update_password = ({ account_id, password }) => {
  return new Promise((resolve, reject) => {
    let query = `update "Account" set password=$2 where account_id=$1`;
    let params = [account_id, password];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(true);
    });
  });
};

// viewer.login = ({ username, password }) => {
//   return new Promise((resolve, reject) => {
//     let query = `select * from "Account" a where a.username=$1 and a.password=$2 and a.status<>-1`;
//     let params = [username, password];

//     conn.query(query, params, (err, res) => {
//       if (err) {
//         console.log(err);
//         return err;
//       } else {
//         if (isEmptyArray(res.rows)) {
//           return resolve(null);
//         } else {
//           return resolve(res.rows[0]);
//         }
//       }
//     });
//   });
// };

viewer.login = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" a where a.username = $1`;
    let params = [username];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else {
        if (
          isEmptyArray(res.rows) ||
          !bcrypt.compareSync(password, res.rows[0].password)
        ) {
          return resolve(null);
        } else {
          return resolve.rows[0];
        }
      }
    });
  });
};

viewer.verify_email = (viewer_id) => {
  return new Promise((resolve, reject) => {
    let query =
      'update "Account" set status = 1 where viewer_id = $1 returning *';
    let params = [viewer_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

viewer.addAccountToken = ({ account_id, access_token }) => {
  return new Promise((resolve, reject) => {
    let num = 1;
    let params = [];

    let query = `update " Account set`;
    if (access_token) {
      query += ` access_token=array_append(access_token, $${num++}),`;
      params.push(access_token);
    }
  });
};

viewer.get_all = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Viewers"`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
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
    let query = `select m.* from "Movie" m, (select * from "MovieFollows" where viewer_id = $1) mf where m.movie_id = mf.movie_id`;
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

viewer.get_comment_history = (viewer_id) => {
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

viewer.get = (viewer_id) => {
  return new Promise((resolve, reject) => {
    let query = `select name, avatar, email, phone, address, account_id from "Viewers" where name = $1 limit 1`;
    let params = [viewer_id];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

module.exports = viewer;
