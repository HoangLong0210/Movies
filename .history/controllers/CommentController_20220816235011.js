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
      case "viewer_comment_fk": {
        utils.onResponse(
          res,
          "fail",
          404,
          message.comment.viewer_comment_fk,
          null,
          null
        );
        break;
      }
      case "movieid_comment_fk": {
        utils.onResponse(
          res,
          "fail",
          404,
          message.comment.movieid_comment_fk,
          null,
          null
        );
        break;
      }
      case "reply_constraint": {
        utils.onResponse(
          res,
          "fail",
          404,
          message.comment.reply_constraint,
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
  } else utils.onResponse(res, "fail", err.code, err.message, null, null);
}

comment.onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    onCatchError(data, res);
  } else {
    utils.onResponse(res, "success", 200, data.message, data.page, data.data);
  }
};

comment.getAllCommentOfBook = async (req, res, next) => {
  let page = req.query.page;
  if (!page) page = 1;
  let comments = [];
  try {
    if (!(await MovieModule.get(req.params.movie_id)))
      return next(new Err(message.movie.not_found, 404));
    let result = await CommentModule.get_all(req.params.movie_id, page);
    result.forEach((e) => {
      comments.push({
        id: Number(e.id),
        id_root: Number(e.id_root),
        movie_id: e.movie_id,
        content: e.content,
        files: e.files,
        time: e.time,
        viewer: {
          viewer_id: Number(e.viewer_id),
          account_id: Number(e.account_id),
          name: e.name,
          avatar: e.avatar,
          status: Number(e.status),
          email: e.email,
          role: Number(e.role),
        },
      });
    });
    next({ data: comments, page: page });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};
