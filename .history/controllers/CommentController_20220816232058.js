const CommentModule = require("../modules/CommentModule");
const MovieModule = require("../modules/MovieModule");
const FileModule = require("../modules/FileModule");
const EpisodeModule = require("../modules/EpisodeModule");

const message = require("../configs/Message");
const utils = require("../utils/utils");

const comment = {};

class Err extends Error {
  constructor(message, code, constraint) {
    super(message);
    this.message = message;
    this.code = code;
    this.constraint = constraint;
  }
}

function onCatchError(err,res)=>{

}