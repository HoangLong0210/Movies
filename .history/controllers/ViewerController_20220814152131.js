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

viewer.getCurrentViewerInfo = async (req, res, next) => {
  try {
    let viewer = await ViewerModule.get_viewer_info(req.params.viewer_id);
    if (viewer) next({ data: [viewer] });
    else next(new Err(message.viewer.not_found, 404));
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

viewer.get = async (req, res, next) => {
  try {
    var viewer = await viewerModule.get(req.params.viewername);
    if (viewer) next({ data: [viewer] });
    else next(new Err(message.viewer.not_found, 404));
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};
