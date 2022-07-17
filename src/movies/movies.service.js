const knex = require("../db/connection");

//Returns a list of movies
function list() {
  return knex("movies").select("*");
}

//Returns a list of movies showing
function isShowing() {
    return knex("movies_theaters")
        .join("movies", "movies_theaters.movie_id", "movies.movie_id")
        .select("movies.*")
        .where({"movies_theaters.is_showing": true})
        .distinct("movies_theaters.movie_id");
  }

//Returns movie information
  function read(movie_id) {
    return knex("movies").where({movie_id}).first();
  }

//Returns the nearest theater showing a movie.
function theaterShowing(movieId) {
    return knex("movies_theaters")
        .join("movies", "movies_theaters.movie_id", "movies.movie_id")
        .join("theaters", "theaters.theater_id", "movies_theaters.theater_id")
        .select("theaters.*")
        .where({"movies_theaters.movie_id": movieId})
        .distinct("movies_theaters.theater_id");
}

module.exports = {
  list,
  isShowing,
  read,
  theaterShowing,
};


