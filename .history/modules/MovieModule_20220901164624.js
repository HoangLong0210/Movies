const constants = require("../configs/Constants");
const conn = require("../Connection");

const movie = {};

movie.get_all_movie = (page) => {
  return new Promise((resolve, reject) => {
    let params = [];
    let query = `select * from "Movie"`;
    query +=
      " where limit " +
      constants.limit_element +
      " offset " +
      constants.limit_element * (page - 1);

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  });
};

movie.filter_with_genres = (filter, page) => {
  return new Promise((resolve, reject) => {
    let num = 3;
    let params = [filter.genres, filter.genres.length];
    let query = `select m.* from "Movie" m,  (select movie_id count(movie_id) as count from "MovieGenres" where genre_id = any($1:: []) group by movie_id) as mg where m.movie_id = mg.movie_id`;
    if (filter.title) {
      query += ` and title ilike $` + num;
      num += 1;
      params.push("%" + filter.title + "%");
    }
    query += ` and count >= $2
    order by count desc`;
    query +=
      " limit " +
      constants.limit_element +
      " offset " +
      constants.limit_element * (page - 1);

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  });
};

movie.filter_without_genres = (filter, page) => {
  return new Promise((resolve, reject) => {
    let num = 1;
    let params = [];
    let query = `select * from "Movie"`;

    if (filter.title) {
      query += ` where title ilike $` + num;
      num += 1;
      params.push("%" + filter.title + "%");
      console.log(num);
    }
    query +=
      " limit " +
      constants.limit_element +
      " offset " +
      constants.limit_element * (page - 1);

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  });
};

movie.get_suggest_movie = (viewer_id) => {
  return new Promise((resolve, reject) => {
    let query = `select m.* from (select movie_id, count(movie_id) as count from (select * from "MovieGenres" where movie_id not in (select movie_id from "MovieFollows" where viewer_id = $1)) as mg where genre_id in (select genre_id from (select mg.genre_id as genre_id, count(genre_id) as count from (select "MovieFollows".movie_id from "MovieFollows" where viewer_id = $1) mf, "MovieGenres" mg where mf.movie_id = mg.movie_id group by movie_id order by count desc limit 20) as g) group by movie_id order by count desc limit 20) as sg, "Movie" m where m.movie_id = sg.movie_id`;
    let params = [viewer_id];
    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

movie.get_top_search = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Movie" order by search_number desc limit 20`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

movie.get_top_view = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Movie" order by view_number desc limit 20`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

movie.get_top_rating = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Movie" order by rating desc limit 20`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

movie.get_top_follow = () => {
  return new Promise((resolve, reject) => {
    let query = `select m.* from (select movie_id, count(viewer_id) as count from "MovieFollows" group by movie_id limit 20) as v, "Movie" m where v.movie_id = m.movie_id order by count desc`;

    conn.query(query, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

movie.get_relate_movie = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select * from "Movie", (select movie_id, count(movie_id) as count from "MovieGenres" where genre_id in (select genre_id from "MovieGenres" where movie_id = $1) and movie_id <> $1 group by movie_id order by count desc limit 20) as g where movie_id = movie_id`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.rows);
    });
  });
};

movie.get = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select * from "Movie" where movie_id = $1 limit 1`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows[0]);
    });
  });
};

movie.get_detail = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select * from (select * from "Movie" m where movie_id = $1 limit 1) m,
    (select json_agg(jsonb_build_object('movie_id', movie_id, 'genre_id',genre_id, 'slug', btrim(slug), 'title', btrim(title), 'description', btrim(description))) genres from "Genre" g, (select * from "MovieGenres" where movie_id = $1) mg where g.genre_id = mg.genre_id) g, (select count(viewer_id) follow from "MovieFollows" where movie_id = $1) f`;

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

movie.get_viewer_follow = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select viewer_id, account_id, name, avatar, email, phone, address, gender from "Viewers" where viewer_id in (select viewer_id from "MovieFollows" where movie_id = $1)`;

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  });
};

movie.add = (movie) => {
  return new Promise((resolve, reject) => {
    let num = 3;
    let params = [movie.movie_id, movie.title];
    let query =
      'insert into "Movie" (movie_id, title' +
      (movie.slug ? ", slug" : "") +
      (movie.titleenglish ? ", titleEnglish" : "") +
      (movie.poster ? ", poster" : "") +
      (movie.description ? ", description" : "") +
      (movie.releasemovie ? ", releaseMovie" : "") +
      (movie.nation ? ", nation" : "") +
      (movie.typeservice ? ", typeService" : "") +
      (movie.url_trailer ? ", url_trailer" : "") +
      (movie.typemovie ? ", typeMovie" : "") +
      (movie.status_movie ? ", status_movie" : "") +
      ") values ($1, $2";

    if (movie.slug) {
      query += ", $" + num;
      num += 1;
      params.push(movie.slug);
    }
    if (movie.titleenglish) {
      query += ", $" + num;
      num += 1;
      params.push(movie.titleenglish);
    }
    if (movie.poster) {
      query += ", $" + num;
      num += 1;
      params.push(movie.poster);
    }
    if (movie.description) {
      query += ", $" + num;
      num += 1;
      params.push(movie.description);
    }
    if (movie.releasemovie) {
      query += ", $" + num;
      num += 1;
      params.push(movie.releasemovie);
    }
    if (movie.nation) {
      query += ", $" + num;
      num += 1;
      params.push(movie.nation);
    }
    if (movie.typeservice) {
      query += ", $" + num;
      num += 1;
      params.push(movie.typeservice);
    }
    if (movie.url_trailer) {
      query += ", $" + num;
      num += 1;
      params.push(movie.url_trailer);
    }
    if (movie.typemovie) {
      query += ", $" + num;
      num += 1;
      params.push(movie.typemovie);
    }
    if (movie.status_movie) {
      query += ", $" + num;
      num += 1;
      params.push(movie.status_movie);
    }
    query += ") returning *;";

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(res.rows[0]);
      }
    });
  });
};

movie.add_movie_genres = (movie_id, genres) => {
  return new Promise((resolve, reject) => {
    let num = 2;
    let params = [movie_id];
    let query = 'insert into "MovieGenres" values';
    genres.forEach((genre_id) => {
      if (num > 2) query += ",";
      query += " ($1, $" + num + ")";
      num += 1;
      params.push(genre_id);
    });
    query += " returning *";

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(res.rows);
      }
    });
  });
};

movie.update_info = (movie, movie_id) => {
  return new Promise((resolve, reject) => {
    let num = 1;
    let params = [];
    let query = 'update "Movie" set ';
    if (movie.movie_id) {
      if (num > 1) query += ",";
      query += " movie_id = $" + num;
      num += 1;
      params.push(movie.movie_id);
    }
    if (movie.slug) {
      if (num > 1) query += ",";
      query += " slug = $" + num;
      num += 1;
      params.push(movie.slug);
    }
    if (movie.title) {
      if (num > 1) query += ",";
      query += " title = $" + num;
      num += 1;
      params.push(movie.title);
    }
    if (movie.titleenglish) {
      if (num > 1) query += ",";
      query += " titleenglish = $" + num;
      num += 1;
      params.push(movie.titleenglish);
    }
    if (movie.poster) {
      if (num > 1) query += ",";
      query += " poster = $" + num;
      num += 1;
      params.push(movie.poster);
    }
    if (movie.description) {
      if (num > 1) query += ",";
      query += " description = $" + num;
      num += 1;
      params.push(movie.description);
    }
    if (movie.releasemovie) {
      if (num > 1) query += ",";
      query += " releasemovie = $" + num;
      num += 1;
      params.push(movie.releasemovie);
    }
    if (movie.nation) {
      if (num > 1) query += ",";
      query += " nation = $" + num;
      num += 1;
      params.push(movie.nation);
    }
    if (movie.typeservice) {
      if (num > 1) query += ",";
      query += " typeservice = $" + num;
      num += 1;
      params.push(movie.typeservice);
    }
    if (movie.url_trailer) {
      if (num > 1) query += ",";
      query += " url_trailer = $" + num;
      num += 1;
      params.push(movie.url_trailer);
    }
    if (movie.rating) {
      if (num > 1) query += ",";
      query += " rating = $" + num;
      num += 1;
      params.push(movie.rating);
    }
    if (movie.rate_count) {
      if (num > 1) query += ",";
      query += " rate_count = $" + num;
      num += 1;
      params.push(movie.rate_count);
    }
    if (movie.search_number) {
      if (num > 1) query += ",";
      query += " search_number = $" + num;
      num += 1;
      params.push(movie.search_number);
    }
    if (movie.view_number) {
      if (num > 1) query += ",";
      query += " view_number = $" + num;
      num += 1;
      params.push(movie.view_number);
    }
    if (movie.typemovie) {
      if (num > 1) query += ",";
      query += " typemovie = $" + num;
      num += 1;
      params.push(movie.typemovie);
    }
    if (movie.status_movie) {
      if (num > 1) query += ",";
      query += " status_movie = $" + num;
      num += 1;
      params.push(movie.status_movie);
    }

    query += " where movie_id = $" + num + " returning *";
    params.push(movie_id);

    if (num == 1) query = 'select * from "Movie" where movie_id = $1 limit 1';

    conn.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows[0]);
    });
  });
};

module.exports = movie;
