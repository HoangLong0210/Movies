const slugify = require("slugify");
const slug = {};

slug.get_slug = (req, res, next) => {
  let title = req.body.title;
  if (title) {
    try {
      req.body.slug = slugify(title, { lower: true, strict: true });
    } catch (e) {
      next(e);
      return;
    }
  }
  next();
};
module.exports = slug;
