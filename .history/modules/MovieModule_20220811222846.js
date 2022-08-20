const constants = require("../configs/Constants");
const conn = require("../Connection");
const movie = {};
movie.get_all_movie = (page) => {
  return new Promise((resolve, reject) => {
    let param = [];
    let query = `select * from "Movie"`;
    query +=
      " where limit " +
      constants.limit_element +
      " offset " +
      constants.limit_element * (page - 1);
  });
};
