const constants = require("../configs/Constants");
const conn = require("../Connection");

const person = {};

person.get_list_person = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select MP.person_id, FP.name, FP.avatar, FP.birthday, FP.nation,
    FP.gender, FP.career, M.mission_name from "FamousPerson" FP inner join "MoviePerson" MP on FP.person_id = MP.person_id inner join "Mission" M on MP.mission_id = M.mission_id where movie_id= $1`;

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        //console.log(res.rows);
        return resolve(res.rows);
      }
    });
  });
};

person.get_list_actor = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select MP.person_id, FP.name, FP.avatar, FP.birthday, FP.nation,
    FP.gender, FP.career, M.mission_name from "FamousPerson" FP inner join "MoviePerson" MP on FP.person_id = MP.person_id inner join "Mission" M on MP.mission_id = M.mission_id where movie_id= $1 and M.mission_id=1`;

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        //console.log(res.rows);
        return resolve(res.rows);
      }
    });
  });
};

person.get_list_director = (movie_id) => {
  return new Promise((resolve, reject) => {
    let params = [movie_id];
    let query = `select MP.person_id, FP.name, FP.avatar, FP.birthday, FP.nation,
    FP.gender, FP.career, M.mission_name from "FamousPerson" FP inner join "MoviePerson" MP on FP.person_id = MP.person_id inner join "Mission" M on MP.mission_id = M.mission_id where movie_id= $1 and M.mission_id=1`;

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err);
      } else {
        //console.log(res.rows);
        return resolve(res.rows);
      }
    });
  });
};

module.exports = person;
