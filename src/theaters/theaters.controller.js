const service = require("./theaters.service");
const { theaterShowing } = require("../movies/movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Returns theaters playing a specific movie OR populates a list of movie theaters in their corresponding show times
async function list(req, res) {
  const { movieId } = req.params;

  if (movieId !== undefined) {
    res.json({ data: await theaterShowing(movieId) });
  } else {
    const theaterList = await service.list();
    const theatersMovieList = theaterList.map(async (theater) => {
      return { ...theater, movies: await service.theaterShowings(theater) };
    });

    res.json({ data: await Promise.all(theatersMovieList) });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};
