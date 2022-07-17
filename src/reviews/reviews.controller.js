const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Returns all reviews for a individual movie
async function readReviews(req, res) {
  const { movieId } = req.params;
  res.json({ data: await service.movieReviews(movieId) });
}

//Checks to see if reviewId exists
async function reviewIdExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.readReview(reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }

  next({ status: 404, message: "Review cannot be found." });
}

//Updates the review
async function update(req, res) {
  const { review_id, critic_id } = res.locals.review;
  const reviewUpdate = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  await service.update(reviewUpdate);

  const review = await service.readReview(review_id);
  const UpdatedReview = {
    ...review,
    updated_at: "string",
    created_at: "string",
    critic: await service.readCritic(critic_id),
  };

  res.json({ data: UpdatedReview });
}

//Destroys review
async function destroy(_req, res) {
  const { review_id } = res.locals.review;
  await service.destroyReview(review_id);
  res.sendStatus(204);
}

module.exports = {
  read: asyncErrorBoundary(readReviews),
  update: [asyncErrorBoundary(reviewIdExists), update],
  delete: [asyncErrorBoundary(reviewIdExists), destroy],
};
