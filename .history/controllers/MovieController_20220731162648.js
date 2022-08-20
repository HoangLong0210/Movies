const MovieModule = require("../modules/MovieModule");
const utils = require("../utils/ultils");
const message = require("../configs/Message");

const movie = {};
class Err extends Error {
  constructor(message, code, constraint) {
    super(message);
    this.message = message;
    this.code = code;
    this.constraint = constraint;
  }
}

function onCatchError(err, res) {
  if (err.constraint) {
    switch (err.constraint) {
      case "movie_pk": {
        utils.onResponse(res, "fail", 400, message.movie.movie_pk, null, null);
        break;
      }
      case "genre_fk": {
        break;
      }
      case "movie_fk": {
      }
    }
  }
}
