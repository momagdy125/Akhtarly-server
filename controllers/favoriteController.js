const moviesModel = require("../models/moviesModel");
const userModel = require("../models/userModel");

exports.getFavorites = (req, res) => {
  const userId = req.userData.id;
  userModel.findById(userId).then((user) => {
    res.status(200).json({ state: "Success", favorites: user.favoriteList });
  });
};
exports.addToFavorite = async (req, res) => {
  try {
    const userId = req.userData.id;
    const movieId = req.params.id;

    // Check if the movie ID already exists in the user's favorite list
    const user = await userModel.findById(userId);
    if (user.favoriteList.includes(movieId)) {
      // If the movie ID already exists in the favorite list, send a message indicating it
      return res
        .status(400)
        .json({ message: "Movie already exists in your Favorite List" });
    }

    // If the movie ID doesn't exist, proceed to add it
    const movie = await moviesModel.findById(movieId);
    if (!movie) {
      return res.status(404).send("Movie not found!");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { favoriteList: movieId } },
      { new: true }
    );

    res.status(201).json({
      message: `Added ${movie.name} to your Favorite List`,
      favoriteList: updatedUser.favoriteList,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteFromFavorite = async (req, res) => {
  try {
    const userId = req.userData.id;
    const movieId = req.params.id;

    // Find the user and check if the movie exists in their favorite list
    const user = await userModel.findById(userId);
    if (!user.favoriteList.includes(movieId)) {
      // Movie doesn't exist in the favorite list
      return res
        .status(400)
        .json({ message: "Movie does not exist in your Favorite List" });
    }

    // Update the user document to remove the movie from the favorite list
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { favoriteList: movieId } },
      { new: true }
    );

    res.status(200).json({
      message: `Removed movie with ID ${movieId} from your Favorite List`,
      user: updatedUser.favoriteList,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
