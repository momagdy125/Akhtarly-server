const favoriteController = require("../controllers/favoriteController");
const auth = require("../middlewares/auth.js");
const express = require("express");
const favoriteRouter = express.Router();

favoriteRouter.get("/", auth.verifyToken, favoriteController.getFavorites);

favoriteRouter.patch(
  "/:id",
  auth.verifyToken,
  favoriteController.addToFavorite
);
favoriteRouter.delete(
  "/:id",
  auth.verifyToken,
  favoriteController.deleteFromFavorite
);
module.exports = favoriteRouter;
