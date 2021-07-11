const express = require('express');
const { isLoggedIn, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const {
  getTour,
  getOverview,
  getLoginForm,
  getAccount,
  getTours,
  alerts,
} = require('../controllers/viewsController');

const router = express.Router();

router.use(alerts);

router.get('/', isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getTours);

module.exports = router;
