const { v4: uuidv4 } = require("uuid");
const { validate: uuidValidate } = require("uuid");
const bcrypt = require("bcrypt");

const MovieModule = require("../modules/MovieModule");
const ViewerModule = require("../modules/ViewerModule");
const utils = require("../utils/utils");
const message = require("../configs/Message");
const { role } = require("../configs/Constants");

const viewer = {};

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
      case "viewer_pk": {
        utils.onResponse(
          res,
          "fail",
          400,
          message.viewer.viewer_pk,
          null,
          null
        );
        break;
      }
      case "account_viewer_fk": {
        utils.onResponse(
          res,
          "fail",
          401,
          message.viewer.account_viewer_fk,
          null,
          null
        );
        break;
      }
      case "email_viewer_constraint": {
        utils.onResponse(
          res,
          "fail",
          402,
          message.viewer.email_viewer_constraint,
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

viewer.getCurrentViewerInfo = async (req, res, next) => {
  let { viewer_id } = req.params;
  try {
    res.success({ data: await ViewerModule.get_viewer_info({ viewer_id }) });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

viewer.get = async (req, res, next) => {
  try {
    let viewer = await ViewerModule.get(req.params.viewer_id);
    if (viewer) next({ data: [viewer] });
    else next(new Err(message.viewer.not_found, 404));
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

viewer.getMovieFollowing = async (req, res, next) => {
  var viewer = req.viewer;
  try {
    next({ data: await ViewerModule.get_movie_following(viewer.viewer_id) });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

viewer.getCommentHistory = async (req, res, next) => {
  try {
    if (!(await ViewerModule.get(req.params.viewer_id)))
      return next(new Err(message.viewer.not_found, 404));
    let comments = [];
    let result = await ViewerModule.get_comment_history(req.params.viewer_id);
    result.forEach((e) => {
      comments.push({
        id: Number(e.id),
        id_root: Number(e.id_root),
        movie_id: e.movie_id,
        content: e.content,
        files: e.files,
        time: e.time,
        viewer: {
          viewer_id: e.viewer_id,
          name: e.name,
          avatar: e.avatar,
          email: e.email,
          phone: e.phone,
          address: e.address,
        },
      });
    });
    next({ data: comments });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

// viewer.login = async (req, res, next) => {
//   let { username, password } = req.body;
//   try {
//     if (!username) return next(new Err(message.viewer.username_required));
//     if (!password) return next(new Err(message.viewer.password_required));

//     let account = await ViewerModule.login({
//       username,
//       password,
//     });
//     if (!account) return next(new Err(message.viewer.incorrect_account));
//     let { account_id, role_id } = account;
//     account.info = await ViewerModule.find_viewer_by_account(account_id);
//     if (role_id !== role.viewer) return next(new Err(message.auth.forbidden));
//     if (account.status == "Đã xóa")
//       return next(new Err(message.viewer.account_locked));
//     next({ data: [{ account }], message: message.viewer.login_success });
//   } catch (e) {
//     next(new Err(e.message, 500, e.constraint));
//   }
// };

viewer.login = async (req, res, next) => {
  let { username, password } = req.body;
  try {
    if (!username) return next(new Err(message.viewer.username_required));
    if (!password) return next(new Err(message.viewer.password_required));

    let account = await ViewerModule.login({
      username,
      password,
    });
    if (!account) return next(new Err(message.viewer.incorrect_account));
    let { account_id, role_id } = account;
    // account.info = await ViewerModule.find_viewer_by_account(account_id);
    if (role_id !== role.viewer) return next(new Err(message.auth.forbidden));
    let { viewer_id } = await ViewerModule.find_viewer_by_account({
      account_id,
    });
    let access_token = utils.generateAccessToken({ viewer_id, account_id });
    if (await ViewerModule.addAccountToken({ account_id, access_token })) {
      return next({
        data: [{ access_token }],
        message: message.viewer.login_success,
      });
    }
    // if (account.status == "Đã xóa")
    //   return next(new Err(message.viewer.account_locked));
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

viewer.logout = async (req, res, next) => {
  let { account_id, access_token } = req.viewer;
  try {
    next({
      data: await ViewerModule.removeAccountToken({ account_id, access_token }),
      message: message.viewer.logout_success,
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

viewer.resetPassword = async (req, res, next) => {
  let { password, phone } = req.body;
  let { account_id } = req.viewer || {};
  try {
    if (!account_id) {
      let u = await ViewerModule.find_account_by_viewer({ username: phone });
      account_id = u?.account_id;
    }
    if (!account_id) {
    } else {
    }
  } catch (e) {}
};

viewer.followMovie = async (req, res, next) => {
  try {
    if (!(await MovieModule.get(req.params.movie_id)))
      return next(new Err(message.movie.not_found, 404));
    if (
      await ViewerModule.follow_movie(req.params.movie_id, req.viewer.viewer_id)
    )
      next({ message: message.viewer.followed_movie });
    else next(new Err(message.viewer.can_not_follow_movie, 500));
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

viewer.unfollowMovie = async (req, res, next) => {
  try {
    if (!(await MovieModule.get(req.params.movie_id)))
      return next(new Err(message.movie.not_found, 404));
    if (
      await ViewerModule.unfollow_movie(
        req.params.movie_id,
        req.viewer.viewer_id
      )
    )
      next({ message: message.viewer.unfollowed_book });
    else next(new Err(message.viewer.can_not_unfollow_movie, 500));
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

viewer.getAll = async (req, res, next) => {
  try {
    next({
      data: await ViewerModule.get_all(),
    });
  } catch (e) {
    next(new Err(e.message, 500, e.constraint));
  }
};

module.exports = viewer;
