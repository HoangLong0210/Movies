module.exports = {
  isEmptyArray: (arr) =>
    arr !== undefined &&
    arr !== null &&
    arr.constructor === Array &&
    arr.length === 0,
};
