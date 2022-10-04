const jwt = require("jsonwebtoken");

const ViewerModule = require("../modules/ViewerModule");
const AccountModule = require("../modules/AccountModule");
const ManagerModule = require("../modules/ManagerModule");
const message = require("../configs/Message");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = await User.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

// auth.verifyUser = (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const access_token = authHeader && authHeader.split(" ")[1];
//     if (!access_token)
//       return utils.onResponse(
//         res,
//         "fail",
//         401,
//         message.auth.unauthorized,
//         null,
//         null
//       );

//     jwt.verify(access_token, process.env.ACCESSTOKEN, async (err, data) => {
//       try {
//         if (err)
//           return utils.onResponse(
//             res,
//             "fail",
//             402,
//             message.auth.token_invalid,
//             null,
//             null
//           );

//         let { viewer_id, account_id } = data.user;

//         if (
//           !(await ViewerModule.is_valid_access_token({
//             account_id,
//             access_token,
//           }))
//         )
//           return utils.onResponse(
//             res,
//             "fail",
//             402,
//             message.auth.token_invalid,
//             null,
//             null
//           );
//         if (
//           (await ViewerModule.get_viewer_info({ viewer_id })).role_id !==
//           role.viewer
//         )
//           return utils.onResponse(
//             res,
//             "fail",
//             403,
//             message.auth.forbidden,
//             null,
//             null
//           );
//         if (
//           !(await AccountModule.find_account_by_username({ account_id })).active
//         )
//           return utils.onResponse(
//             res,
//             "fail",
//             403,
//             message.viewer.account_locked,
//             null,
//             null
//           );

//         req.viewer = { viewer_id, account_id, access_token };
//         next();
//       } catch (e) {
//         next(e);
//       }
//     });
//   } catch (e) {
//     next(e);
//   }
// };

auth.verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const access_token = authHeader && authHeader.split(" ")[1];
    if (!access_token)
      return utils.onResponse(
        res,
        "fail",
        401,
        message.auth.unauthorized,
        null,
        null
      );

    jwt.verify(access_token, process.env.ACCESSTOKEN, async (err, data) => {
      try {
        if (err)
          return utils.onResponse(
            res,
            "fail",
            402,
            message.auth.token_invalid,
            null,
            null
          );

        let { viewer_id, account_id } = data.user;

        if (
          !(await ViewerModule.is_valid_access_token({
            account_id,
            access_token,
          }))
        )
          return utils.onResponse(
            res,
            "fail",
            402,
            message.auth.token_invalid,
            null,
            null
          );
        if (
          (await ManagerModule.find_admin_by_account({ account_id }))
            .role_id !== role.manager
        )
          return utils.onResponse(
            res,
            "fail",
            403,
            message.auth.forbidden,
            null,
            null
          );

        req.viewer = { viewer_id, account_id, access_token };
        next();
      } catch (e) {
        next(e);
      }
    });
  } catch (e) {
    next(e);
  }
};

module.exports = auth;
