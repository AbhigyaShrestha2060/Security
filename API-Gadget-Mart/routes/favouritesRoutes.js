// routes/favouritesRoutes.js

const express = require('express');
const router = express.Router();
const favouritesController = require('../controllers/favouritesController');
const { authGuard } = require('../middleware/authGuard');
const { activityLoggerMiddleware } = require('../middleware/LogActivity');

// Route to add item to favorites
router.post(
  '/add',
  authGuard,
  activityLoggerMiddleware,
  favouritesController.favorite
);

// Route to get all favorite items
router.get(
  '/all',
  activityLoggerMiddleware,
  authGuard,
  favouritesController.getAllFavorites
);

// Route to get favorite for user
router.get(
  '/get',
  authGuard,
  activityLoggerMiddleware,
  favouritesController.getFavorite
);

// Route to delete item from favorites
router.delete(
  '/delete/:id',
  authGuard,
  activityLoggerMiddleware,
  favouritesController.deleteFavoriteItem
);

module.exports = router;
