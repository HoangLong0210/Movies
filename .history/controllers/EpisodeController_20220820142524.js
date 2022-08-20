const EpisodeModule = require("../modules/EpisodeModule");
const message = require("../configs/Message");
const utils = require("../utils/utils");
const constants = require("../configs/Constants");

const episode = {};

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
      case "movie_episode_fk": {
        utils.onResponse(
          res,
          "fail",
          400,
          message.episode.not_found,
          null,
          null
        );
        break;
      }

      default: {
        {
          utils.onResponse(res, "fail", 500, err.message, null, null);
          break;
        }
      }
    }
  } else utils.onResponse(res, "fail", err.code, err.message, null, null);
}
