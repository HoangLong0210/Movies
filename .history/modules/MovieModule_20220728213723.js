const conn = require("../Connection");
const constants = require("../configs/Constants");

const movie = {};

movie.get_all_movie = () => {
  return new Promise((resolve, reject) => {
    let param = [];
    let query = `Select * from "Movie"`;
    query +=
      "limit" +
      constants.limit_element +
      "offset" +
      constants.limit_element * (page - 1);

    conn.query(query, param, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  });
};


