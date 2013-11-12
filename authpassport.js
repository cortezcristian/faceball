var passport = require('passport')   
  , LocalStrategy = require('passport-local').Strategy
  , dbConex  = exports.dbConex = module.parent.exports.dbConex
  , Administrador = require('./models/administradores.js');
  
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use('loginAdministradores', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log("llega");
    Administrador.findOne({ email:username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("llegai 2");
      return done(null, user);
    });
  }
));
