const MovieModule = require("../modules/MovieModule");
const utils = require("../utils/utils");
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
        utils.onResponse(res, "fail", 404, message.genre.not_found, null, null);
        break;
      }
      case "movie_fk": {
        utils.onResponse(res, "fail", 404, message.movie.not_found, null, null);
        break;
      }
      default: {
        utils.onResponse(res, "fail", 500, err.message, null, null);
        break;
      }
    }
  } else utils.onResponse(res, "fail", err.code, err.message, null, null);
}

movie.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    onCatchError(data, res);
  } else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};

movie.getAllMovie = async (req, res, next) => {
  let page = req.query.page;
  if (!page) page = 1;
  let filter = utils.parseQueryParamObjToJson(req.query.filter);
  try {
    if (filter.genres && filter.genres.length > 0) {
      next({
        data: await MovieModule.filter_with_genres(filter, page),
        page: page,
      });
    } else {
      next({
        data: await MovieModule.filter_without_genres(filter, page),
        page: page,
      });
    }
  } catch (e) {
    next(Err(e.message, 500, e.constraint));
  }
};

movie.getSuggestMovie = async (req, res, next) => {
  let user = req.user;
  try {
    next({
      data: await MovieModule.get_suggest_movie(user.viewer_id),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

movie.getTopSearch = async (req, res, next) => {
  try {
    next({
      data: await MovieModule.get_top_search(),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

movie.getTopView = async (req, res, next) => {
  try {
    next({
      data: await MovieModule.get_top_view(),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

movie.getTopRating = async (req, res, next) => {
  try {
    next({
      data: await MovieModule.get_top_rating(),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

movie.getTopFollow = async (req, res, next) => {
  try {
    next({
      data: await MovieModule.get_top_follow(),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

module.exports = movie;
