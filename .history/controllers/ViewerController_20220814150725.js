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

viewer.getCurrentUserInfo = async (req, res, next) => {
  let { viewer_id } = req.user;
  try {
    res.success({
      data: await ViewerModule.get_viewer_info({ viewer_id }),
    });
  } catch (e) {
    next(e);
  }
};
