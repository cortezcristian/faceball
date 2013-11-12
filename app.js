
/**
 * Module dependencies.
 */

var express = require('express')
  , utils = require('./utils')
  , config = require('./config')['config']
  , passport = require('passport')
  , http = require('http')
  , path = require('path');

  console.log(config);

/**
* Database Connection
*/
var dbConex = exports.dbConex = utils.dbConnection(config.db.domain,config.db.name,config.db.user,config.db.pass);

/**
* Express App
*/
var app = exports.app = express();

// all environments
app.set('port', process.env.PORT || config.app.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser(config.session.secret));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session())
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
* Passport Auth Strategy
*/
require('./authpassport');


/**
* Routes
*/
require('./routes/main');
// Passport Auth Routes
require('./routes/auth');


var server = exports.server = http.createServer(app).listen(app.get('port'), config.app.domain, function(){
  console.log("Express server listening on port " + app.get('port'));
});

/**
* Socket.io
*/

require('./sockets.js');
