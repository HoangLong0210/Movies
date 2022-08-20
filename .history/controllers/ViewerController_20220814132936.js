const { v4: uuidv4 } = require("uuid");
const { validate: uuidValidate } = require("uuid");

const MovieModule = require("../modules/MovieModule");
const ViewerModule = require("../modules/ViewerModule");
const utils = require("../utils/utils");
const message = require("../configs/Message");

const viewer = {};

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
      case "":
        break;

      default:
        break;
    }
  } else utils.onResponse(res, "fail", err.code, err.message, null, null);
}

viewer.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    onCatchError(data, res);
  } else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};

viewer.verifyEmail = async (req, res, next) => {
  try {
    if (!req.query.token || !uuidValidate(req.query.token))
      return next(new Err(message.auth.token_invalid, 400));
    var data = await TokenModule.delete(req.query.token);
    if (data) {
      var user = await UserModule.verify_email(data.username);
      if (user) next({ message: message.user.email_veified });
      else next(new Err(message.user.not_found, 404));
    } else next(new Err(message.auth.token_invalid, 400));
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};
