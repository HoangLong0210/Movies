const PersonModule = require("../modules/PersonModule");
const utils = require("../utils/utils");
const message = require("../configs/Message");
const constants = require("../configs/Constants");

const person = {};

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
      case "person_pk": {
        utils.onResponse(
          res,
          "fail",
          400,
          message.person.person_pk,
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
  } else utils.onResponse(res, "fail", err.code, err.message, null, null);
}

person.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    onCatchError(data, res);
  } else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};

person.getListPerson = async (req, res, next) => {
  let movie_id = req.params.movie_id;
  try {
    next({
      data: await PersonModule.get_list_person(movie_id),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

person.getDetailPerson = async (req, res, next) => {
  try {
    let person = await PersonModule.get(req.params.person_id);
    if (!person) return next(new Err(message.person.not_found, 404));
    person.directors = await PersonModule.get_list_movie_director(
      req.params.person_id
    );
    next({
      data: await PersonModule.get_list_movie_director(person_id),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

module.exports = person;
