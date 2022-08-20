const GenreModule = require("../modules/GenreModule");
const ultis = require("../utils/utils");
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

function onCatchErr(err,res)
