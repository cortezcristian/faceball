var app = module.parent.exports.app
  , passport = require('passport');

/*
 * Authentication routes
 */
app.post('/admin', 
  passport.authenticate('loginAdministradores', { successRedirect: '/',
                                   failureRedirect: '/admin'})
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


