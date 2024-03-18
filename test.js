function calculateNewRating(currentRating, numRatings, yourRating) {
  // Calculate total sum of ratings before your rating
  let totalSumBefore = currentRating * numRatings;

  // Add your rating to the total sum
  let totalSumAfter = totalSumBefore + yourRating;

  // Calculate new average rating
  let newAverageRating = totalSumAfter / (numRatings + 1);

  return newAverageRating.toFixed(1);
}

// Example usage:
let currentRating = 3.8;
let numRatings = 5;
let yourRating = 2;

let newRating = calculateNewRating(currentRating, numRatings, yourRating);
console.log("New average rating:", newRating);
