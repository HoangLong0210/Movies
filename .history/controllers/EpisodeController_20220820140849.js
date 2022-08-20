const EpisodeModule = require("../modules/EpisodeModule");
const message = require("../configs/Message");
const utils = require("../utils/utils");
const constants = require("../configs/Constants");

const episode = {};

class Err extends Error {
  constructor(message, code, constraint) {
    super(message);
    this.message = message;
    this.code = code;
    this.constraint = constraint;
  }
}
