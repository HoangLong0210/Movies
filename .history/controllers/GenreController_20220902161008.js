const GenreModule = require("../modules/GenreModule");
const utils = require("../utils/utils");
const message = require("../configs/Message");

const genre = {};

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
      case "genre_pk": {
        utils.onResponse(res, "fail", 400, message.genre.genre_pk, nul, null);
        break;
      }
      case "genre_fk": {
        utils.onResponse(res, "fail", 400, message.genre.not_found, nul, null);
        break;
      }
      default: {
        utils.onResponse(res, "fail", 500, err.message, null, null);
        break;
      }
    }
  } else utils.onResponse(res, "fail", err.code, err.message, null, null);
}

genre.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    onCatchError(data, res);
  } else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};

genre.getAllGenre = async (req, res, next) => {
  try {
    next({ data: await GenreModule.get_all() });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

genre.getListMovie = async (req, res, next) => {
  let genre_id = 1;
  try {
    next({
      data: await GenreModule.get_list_movie(genre_id),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

genre.addGenre = async (req, res, next) => {
  let genre = {
    genre_id: req.body.genre_id,
    slug: req.body.slug,
    title: req.body.title,
    description: req.body.description,
  };
  try {
    if (!genre.title) return next(new Err(message.genre.missing_title, 400));
    next({ data: await GenreModule.add(genre) });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

genre.updateGenre = async (req, res, next) => {
  let genre = req.body;
  try {
    genre = await GenreModule.update(genre, req.params.genre_id);
    if (genre) next({ data: [genre], message: message.genre.update_success });
    else next(new Err(message.genre.not_found, 404));
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

module.exports = genre;
