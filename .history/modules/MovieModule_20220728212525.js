const conn = require("../Connection");
const constants = require("../configs/Constants");

const movie = {};

movie.get_all_movie = () => {
  let param = [];
  let query = `Select * from "Movie"`;
  query +=
    "limit" +
    constants.limit_element +
    "offset" +
    constants.limit_element * (page - 1);
};
