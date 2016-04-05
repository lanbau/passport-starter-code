var express = require('express')
var router = express.Router()
var passport = require('passport')
var usersController = require('../controllers/usersController')
var staticsController = require('../controllers/staticsController')

// middleware, next goes to usersController.getSecret
function authenticatedUser (req, res, next) {
  // Success
  if (req.isAuthenticated()) return next()

  // Fail
  req.flash('errorMessage', 'Login to access')
  res.redirect('/login')
}
router.route('/secret')
  .get(authenticatedUser, usersController.getSecret)

router.route('/')
  .get(staticsController.home)

router.route('/signup')
  .get(usersController.getSignup)
  .post(usersController.postSignup)

router.route('/login')
  .get(usersController.getLogin)
  .post(usersController.postLogin)

router.route('/logout')
  .get(usersController.getLogout)

module.exports = router
