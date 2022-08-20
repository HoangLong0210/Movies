const jwt = require("jsonwebtoken");
const { default: slugify } = require("slugify");

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
    } else {
      res.status(code).json({
        status: status,
        code: code,
        message: message || "",
        data: data,
      });
    }
  },
  parseQueryParamObjToJson(obj) {
    try {
      return JSON.parse(obj);
    } catch (ignored) {
      return {};
    }
  },
  get_slug:(title)=>{
    try{
      return slugify(title,{lower:true,strict:true})
    }
  }
};
