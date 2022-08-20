const conn = require("../Connection");

const genre = {};

genre.get = (genre_id) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Genre" where genre_id = $1 limit 1`;
  });
};
