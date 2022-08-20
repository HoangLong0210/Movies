const conn = require("../Connection");

const episode = {};

episode.get = (movie_id, episode_movie) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id, episode_movie];
    let query = `select episode_movie, movie_id, url_movie, duration from "Episode" where movie_id = $1 and episode_movie = $2`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};
