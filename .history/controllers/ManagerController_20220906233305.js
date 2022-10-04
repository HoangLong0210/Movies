const ManagerModule = require("../modules/ManagerModule");
const AccountModule = require("../modules/AccountModule");
const FileModule = require("../modules/FileModule");

const utils = require("../utils/utils");
const message = require("../configs/Message");
const { role } = require("../configs/Constants");

const manager = {};

class Err extends Error {
  constructor(message, code, constraint) {
    super(message);
    this.message = message;
    this.code = code || 500;
    this.constraint = constraint || "";
  }
}

function onCatchError(err, res) {
  if (err.constraint) {
    switch (err.constraint) {
      case "manager_pk": {
        utils.onResponse(
          res,
          "fail",
          400,
          message.manager.manager_pk,
          null,
          null
        );
        break;
      }
      case "account_manager_fk": {
        utils.onResponse(
          res,
          "fail",
          401,
          message.manager.account_manager_fk,
          null,
          null
        );
        break;
      }
      case "email_manager_constraint": {
        utils.onResponse(
          res,
          "fail",
          402,
          message.manager.email_manager_constraint,
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
  } else {
    console.log("error", err.code);
    utils.onResponse(res, "fail", err.code, err.message, null, null);
  }
}

viewer.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    onCatchError(data, res);
  } else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};

module.exports = manager;
