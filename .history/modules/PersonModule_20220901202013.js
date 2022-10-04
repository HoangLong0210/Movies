const constants = require("../configs/Constants");
const conn = require("../Connection");

const person = {};

person.get_detail = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select * from (select * from "Movie" m where movie_id = $1 limit 1) m,
    (select json_agg(jsonb_build_object('movie_id', movie_id, 'slug', btrim(slug), 'title', btrim(title), 'description', btrim(description))) genres from "Genre" g, (select * from "MovieGenres" where movie_id = $1) mg where g.genre_id = mg.genre_id) g, (select count(viewer_id) follow from "MovieFollows" where movie_id = $1) f`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      let movie = res.rows[0];
      if (movie) {
        movie.follow = Number(movie.follow);
        movie.view = Number(movie.view);
      }
      return resolve(movie);
    });
  });
};
