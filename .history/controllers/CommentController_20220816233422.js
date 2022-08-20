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

function onCatchError(err, res) {
  if (err.constraint) {
    switch (err.constraint) {
      case "comment_pk": {
        utils.onResponse(
          res,
          "fail",
          400,
          message.comment.comment_pk,
          null,
          null
        );
        break;
      }
      case "viewer_comment_fk":
        {
          utils.onResponse(
            res,
            "fail",
            404,
            message.comment.viewer_comment_fk,
            null,
            null
          );
        }

        break;

      default:
        break;
    }
  }
}
