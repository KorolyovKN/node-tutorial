var express = require('express'); //connect with express
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);


var app = express(); //create application

app.engine('ejs', require('ejs-locals'));
log.info(__dirname);
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');
app.use(express.favicon());
if (app.get('env') == 'development') {
  app.use(express.logger('dev'));
} else {
  app.use(express.logger('default'));
}
app.use(express.bodyParser());

app.use(express.cookieParser('your secret here'));

app.use(app.router);

app.get('/', function (req, res, next) {
  res.render('index', {});
});

var User = require('./models/user').User;
app.get('/users', function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) return next(err);
    res.json(users);
  })
});

app.get('/user/:id', function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);
    if (!user) {
      next(new HttpError(404, "User not found"));
    }
    res.json(user);
  })
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next) {
  if (app.get('env') == 'development') {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});




/*

var routes = require('./routes');
var user = require('./routes/user');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
*/


http.createServer(app).listen(config.get('port'), function(){ //create server
  log.info('Express server listening on port ' + config.get('port'));
});