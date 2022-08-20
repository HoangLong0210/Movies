const bcrypt = require("bcrypt");
const e = require("express");

const contants = require("../configs/Constants");
const message = require("../configs/Message");

const encrypt = {};

encrypt.hash = (req, res, next) => {
  let pwd = req.body.password;
  if (!pwd || pwd.trim().length === 0) {
    return res.status(400).json({
      status: "fail",
      code: 400,
      message: message.encypt.password_required,
      dât: null,
    });
  }
};
