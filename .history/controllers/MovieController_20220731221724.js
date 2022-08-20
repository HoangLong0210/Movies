const MovieModule = require("../modules/MovieModule");
const utils = require("../utils/utils");
const message = require("../configs/Message");
const ultils = require("../utils/utils");

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
        utils.onResponse(res, "fail", 404, message.genre.not_found, null, null);
        break;
      }
      case "movie_fk": {
        ultils.onResponse(
          res,
          "fail",
          404,
          message.movie.not_found,
          null,
          null
        );
        break;
      }
      default: {
        utils.onResponse(res, "fail", 500, err.message, null, null);
        break;
      }
    }
  }
}

movie.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) onCatchError(data, res);
  else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};
