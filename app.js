
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view options', {layout: 'index-layout'});
	app.set('view options', {layout: 'profile-layout'});
	app.set('view options', {layout: 'login-layout'});
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'your secret here' }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes


var routes          = require('./routes')(app);

// app.get('/', routes.index);

var logRrequest     = require('./libs/logRequests');

app.post('/login', function (req, res) {
	logRrequest[req.body.action](req, function (body) {
		res.send(body);
	});
});

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
