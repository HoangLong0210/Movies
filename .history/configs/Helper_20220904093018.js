module.exports = {
  isObject: (obj) => {
    return obj !== undefined && obj !== null && obj.constructor === Object;
  },
  isEmptyArray: (arr) =>
    arr !== undefined &&
    arr !== null &&
    arr.constructor === Array &&
    arr.length === 0,
  isValidatePhone: (phone) => {
    const regexPhone = /^[0][\d]{9}$/;
    return regexPhone.test(phone);
  },
};
