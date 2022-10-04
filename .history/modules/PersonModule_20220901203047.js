const constants = require("../configs/Constants");
const conn = require("../Connection");

const person = {};

person.get_detail = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select * from (select * from "Movie" m where movie_id = $1 limit 1) m,
    (select json_agg(jsonb_build_object('person_id', person_id, 'name', btrim(name), 'avatar', btrim(avatar), 'birthday', btrim(birthday), 'nation', btrim(nation), 'gender', btrim(gender), 'career', (career))) person from "FamousPerson" FP, (select * from "MoviePerson" where movie_id = $1) MP where FP.person_id = MP.person_id) MP, (select * from "Mission" M2 where MP.mission_id = M2.mission_id) f`;
    // select MP.person_id, FP.name, FP.avatar, FP.birthday, FP.nation,
    // FP.gender, FP.career, M2.mission_name from "Movie" m inner join "MoviePerson" MP on
    // m.movie_id = MP.movie_id inner join "FamousPerson" FP on MP.person_id = FP.person_id inner join "Mission" M2 on MP.mission_id = M2.mission_id
    // where m.movie_id=1

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(res.rows[0]);
      }
    });
  });
};
