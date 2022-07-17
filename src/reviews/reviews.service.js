const knex = require("../db/connection");

//Returns an individual review
function readReview(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).first();
}

//Returns individual critic 
function readCritic(criticId) {
  return knex("critics").where({ critic_id: criticId }).first();
}

//Helper function for movieReviews function
async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

//Lists all reviews for individual movie
async function movieReviews(movieId) {
  const reviews = await knex("reviews").where({ movie_id: movieId });
  return await Promise.all(reviews.map(setCritic));
}

//Updates reviews
async function update(updatedReview) {
  const review = await knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
  review[0];
}

//Destroys a review
function destroyReview(reviewId) {
  return knex("reviews").where({review_id: reviewId}).delete();
}

module.exports = {
  readReview,
  readCritic,
  movieReviews,
  update, 
  destroyReview,
};