const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keyToken = `Odfm&4HiOLdvvBZJTi%BMnG2N7XXsz5a`;

const user = {};

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ username: user.username }, keyToken);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where username = $1, password = $2`;

    let params = [email, password];

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

module.exports = user;
