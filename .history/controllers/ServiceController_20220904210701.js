const ServiceModule = require("../modules/ServiceModule");
const message = require("../configs/Message");
const utils = require("../utils/utils");

const service = {};

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
      case "service_pk": {
        utils.onResponse(
          res,
          "fail",
          400,
          message.service.service_pk,
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

service.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    onCatchError(data, res);
  } else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};

service.getAll = async (req, res, next) => {
  try {
    next({
      data: await ServiceModule.get_all(),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

module.exports = service;
