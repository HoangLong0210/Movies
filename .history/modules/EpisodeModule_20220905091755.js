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

episode.get_detail = (movie_id, episode_movie) => {
  return new Promise((resolve, reject) => {
    let query = `select *from "Episode" where episode_movie = $2 and movie_id = $1`;

    let params = [movie_id, episode_movie];
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

episode.get_all = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select episode_movie, movie_id, url_movie, duration, is_published from "Episode" where movie_id = $1`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

episode.get_all_episode = (movie_id) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Episode" `;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

episode.add = (episode) => {
  let params = [
    episode.episode_movie,
    episode.movie_id,
    episode.url_movie,
    episode.duration,
  ];
  let query = `insert into "Episode" (episode_movie, movie_id, url_movie, duration) values ($1, $2, $3, $4) returning episode_movie, movie_id, url_movie, duration`;
  conn.query(query, params, (err, res) => {
    if (err) return reject(err);
    else return resolve(res.rows[0]);
  });
};

episode.update = (episode, episode_movie) => {
  return new Promise((resolve, reject) => {
    let params = [
      episode.episode_movie,
      episode.url_movie,
      episode.duration,
      episode_movie,
      episode.movie_id,
    ];
    let query = `update "Episode" set episode_movie = $1, url_movie = $2, duration = $3 where episode_movie = $4 and movie_id = $5 returning episode_movie, movie_id, url_movie, duration`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows[0]);
    });
  });
};

// episode.delete = (movie_id, episode_movie) => {
//   return new Promise((resolve, reject) => {
//     let params = [movie_id, episode_movie];
//     let query = `delete from "Episode" where movie_id = $1 and episode_movie = $2 returning episode_movie, movie_id, url_movie, duration`;

//     conn.query(query, params, (err, res) => {
//       if (err) return reject(err);
//       else return resolve(res.rows[0]);
//     });
//   });
// };

module.exports = episode;
