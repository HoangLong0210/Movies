const conn = require("../Connection");
const ViewerMoudle = "../modules/ViewerModule.js";
//const functionConfig = require("../util/function");

module.exports.login = async (req, res, next) => {
  try {
    const username = req.body.email.toLowerCase();

    let tbuser = await functionConfig.findUserByEmail(email);

    if (!tbuser) {
      return res.status(400).json({ message: "Không tìm thấy email" });
    } else if (tbuser.verified_email === null) {
      return res.status(400).json({
        message:
          "Tài khoản của bạn chưa được xác thực. Vui lòng xác thực gmail",
      });
    }

    const isPasswordMatched = await functionConfig.checkHashString(
      req.body.password,
      tbuser.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Mật khẩu sai" });
    }

    let tokeninfo = {
      user: {
        id: tbuser.user_id,
        name: tbuser.name,
        birthdate: tbuser.birthdate,
        email: tbuser.email,
        address: tbuser.address,
        phone: tbuser.phone,
        status: tbuser.status,
        google_id: tbuser.google_id,
        facebook_id: tbuser.facebook_id,
        role: tbuser.role,
        verified_email: tbuser.verified_email,
      },
    };

    const accessToken = await functionConfig.generateAccessToken(tokeninfo);

    res.cookie("glcookie", accessToken, {
      maxAge: 90000000,
      httpOnly: true,
    });
    res.status(200).json({
      token: accessToken,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.loginGG = async (req, res, next) => {
  try {
    const { ggInfo } = req;
    let tbuser;

    const checkID = await db.getFirstResult(
      "select * FROM users WHERE google_id = $1",
      [ggInfo.sub]
    );

    if (!checkID) {
      const checkEmail = await db.getFirstResult(
        "SELECT * FROM users WHERE email = $1",
        [ggInfo.email]
      );

      if (checkEmail) {
        const updateID = (
          await db.query(
            "update users set google_id = $1 where email = $2 returning *",
            [ggInfo.sub, ggInfo.email]
          )
        ).rows[0];
        tbuser = updateID;
      } else {
        const newUser = (
          await db.query(
            `insert into users (name, birthdate, email, address, phone, status, google_id, facebook_id, verified_email)
            values ($1, now(), $2, $3, $4, $5, $6, $7, $8) returning *`,
            [
              ggInfo.name,
              ggInfo.email,
              "",
              "",
              "working",
              ggInfo.sub,
              "",
              "verified",
            ]
          )
        ).rows[0];
        tbuser = newUser;
      }
    } else {
      tbuser = checkID;
    }

    let tokeninfo = {
      user: {
        id: tbuser.user_id,
        name: tbuser.name,
        birthdate: tbuser.birthdate,
        email: tbuser.email,
        address: tbuser.address,
        phone: tbuser.phone,
        status: tbuser.status,
        google_id: tbuser.google_id,
        facebook_id: tbuser.facebook_id,
        role: tbuser.role,
        verified_email: tbuser.verified_email,
      },
    };

    const accessToken = functionConfig.generateAccessToken(tokeninfo);

    res.cookie("glcookie", accessToken, {
      maxAge: 90000000,
      httpOnly: true,
    });
    res.status(200).json({
      token: accessToken,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.loginFB = async (req, res, next) => {
  try {
    const { fbInfo } = req;
    let tbuser;

    if (!fbInfo.email) {
      return res.status(400).json({
        message:
          "Không thể đăng nhập facebook. Vui lòng cập nhật địa chỉ email ở facebook",
      });
    }

    const checkID = await db.getFirstResult(
      "select * from users where facebook_id = $1",
      [fbInfo.id]
    );

    if (!checkID) {
      const checkEmail = await db.getFirstResult(
        "select * from users where email = $1",
        [fbInfo.email]
      );

      if (checkEmail) {
        const updateID = (
          await db.query(
            "update users set facebook_id = $1 WHERE email = $2 returning *",
            [fbInfo.id, fbInfo.email]
          )
        ).rows[0];
        tbuser = updateID;
      } else {
        const newUser = (
          await db.query(
            `insert into users (name, birthdate, email, address, phone, status, google_id, facebook_id, verified_email)
            values ($1, now(), $2, $3, $4, $5, $6, $7, $8) returning *`,
            [
              fbInfo.name,
              fbInfo.email,
              "",
              "",
              "working",
              "",
              fbInfo.id,
              "verified",
            ]
          )
        ).rows[0];
        tbuser = newUser;
      }
    } else {
      tbuser = checkID;
    }

    let tokeninfo = {
      user: {
        id: tbuser.user_id,
        name: tbuser.name,
        birthdate: tbuser.birthdate,
        email: tbuser.email,
        address: tbuser.address,
        phone: tbuser.phone,
        status: tbuser.status,
        google_id: tbuser.google_id,
        facebook_id: tbuser.facebook_id,
        role: tbuser.role,
        verified_email: tbuser.verified_email,
      },
    };

    const accessToken = await functionConfig.generateAccessToken(tokeninfo);

    res.cookie("glcookie", accessToken, {
      maxAge: 90000000,
      httpOnly: true,
    });
    res.status(200).json({
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

module.exports.logout = async (req, res, next) => {
  res.clearCookie("glcookie");
  res.status(200).json({ message: "Đăng xuất thành công" });
};
