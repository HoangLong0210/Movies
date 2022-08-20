const jwt = require("jsonwebtoken");

module.exports = {
  onResponse(res, status, code, message, page, data) {
    if (page) {
      res.status(code).json({
        status: status,
        code: code,
        message: message || "",
        page: Number(page),
        data: data,
      });
    }
  },
};
