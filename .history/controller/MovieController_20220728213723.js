const MovieModule = require("../modules/MovieModule");

const movie = {};
class Err extends Error {
  constructor(message, code, constraint) {
    super(message);
    this.message = message;
    this.code = code;
    this.constraint = constraint;
  }
}

function onCatchError(err,res) {
  if(err.constraint) {
    switch(err.constraint) {
      case 'movie_pk':{
        utils.on
      }
    }
  }
}