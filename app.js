
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Helpers

app.dynamicHelpers({
  url: function(req,res){
    return function(path){
      var host = req.headers['host'];
      var scheme = 'http';
      return scheme + "://" + host + path;
    }
  }
});

// Routes

app.get('/', routes.index);

// Sockets

var numConnections = 0;
io.sockets.on('connection', function(s){
  numConnections++;
  io.sockets.emit('update', {total:numConnections});
  s.on('disconnect', function(){
    numConnections--;
    io.sockets.emit('update',{total:numConnections});
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});