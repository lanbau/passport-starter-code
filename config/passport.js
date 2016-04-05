var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')
// passReqToCallback means pass request to the callback function
module.exports = function (passport) {

  // passport expects us to give them an id
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  // passport expect us to give them a user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    // Find a user with this email
    // local because it's defined in models/user.js
    User.findOne({'local.email': email}, function (err, user) {
      if (err) return done(err)

      // If there is a user with this email
      if (user) return done(null, false, req.flash('errorMessage', 'This email is already used!'))
      var newUser = new User()
      newUser.local.email = email
      newUser.local.password = User.encrypt(password)

      newUser.save(function (err, user) {
        if (err) return done(err)
        return done(null, user)
      })
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    // Search for a use with this email
    User.findOne({ 'local.email': email }, function (err, user) {
      if (err) return done(err)

      // If no user is found
      if (!user) return done(null, false, req.flash('errorMessage', 'No user found.'))

      // Check if the password is correct
      if (!user.validPassword(password)) return done(null, false, req.flash('errorMessage', 'Oops wrong password!'))

      return done(null, user)
    })
  }))
}
