const constants = require("../configs/Constants");
const conn = require("../Connection");

const person = {};

person.get_list_person = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select * from (select * from "Movie" m where movie_id = $1 limit 1) m,
    (select json_agg(jsonb_build_object('person_id', person_id, 'name', btrim(name), 'avatar', btrim(avatar), 'birthday', btrim(birthday), 'nation', btrim(nation), 'gender', btrim(gender), 'career', (career))) person from "FamousPerson" FP, (select * from "MoviePerson" where movie_id = $1) MP where FP.person_id = MP.person_id) MP, (select * from "Mission" M2 where MP.mission_id = M2.mission_id) f`;

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(res.rows);
      }
    });
  });
};

module.exports = person;
