const EpisodeModule = require("../modules/EpisodeModule");
const MovieModule = require("../modules/MovieModule");
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

episode.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    onCatchError(data, res);
  } else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};

episode.getAllMovie = async (req, res, next) => {
  let movie_id = req.params.movie_id;
  try {
    next({
      data: await EpisodeModule.get_all(movie_id),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

episode.getAll = async (req, res, next) => {
  try {
    next({
      data: await EpisodeModule.get_all_episode(),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

episode.getDetailEpisode = async (req, res, next) => {
  try {
    if (!(await MovieModule.get(req.params.movie_id)))
      return next(new Err(message.movie.not_found, 404));
    episode = await EpisodeModule.get_detail(
      req.params.movie_id,
      req.params.episode_movie
    );
    next({ data: [episode] });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

module.exports = episode;
