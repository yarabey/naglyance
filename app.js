//
///**
// * Module dependencies.
// */
//
//var express = require('express')
//  , routes = require('./routes')
//  , user = require('./routes/user')
//  , http = require('http')
//  , path = require('path');
//
//var app = express();
//
//// all environments
//app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));
//
//// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}
//
//app.get('/', routes.index);
//app.get('/users', user.list);
//
//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});


var config = require("config");
config.app.rootPath = __dirname;
config.app.server.port = process.env.PORT || config.app.server.port;

var dbprovider = require("dbprovider");

var http = require("http"),
    exp = require("express"),
    router = require("router"),
    logger = require("logger"),
    RedisStore = require("connect-redis")(exp),
    domain = require("domain");

dbprovider.init();


var store = new RedisStore(config.redis.session),
    app = exp();
app.root = __dirname;

app.locals({
    title: "НаГлянце.рф"
});

app.configure("all", function() {
    app.use(function(err, req, res, next) {
        logger.writeExpressError(err);
        res.send(500, "Server Error");
    });
    app.set("views", app.root + "/areas");
    app.set("view engine", "jade");
    app.use(exp.static(config.app.rootPath + '/assets'))
    app.use(exp.bodyParser());
    app.use(exp.cookieParser());
    app.use(exp.session({secret: "resources", store: store}));
    app.use(exp.favicon(config.app.rootPath + '/favicon.ico'));
});
app.enable("trust proxy");

app.all("*", router.http);

var sc = config.app.server, port = sc.port;

var httpServer = http.createServer(function(req, res) {
    var dom = domain.create();
    dom.add(req);
    dom.add(res);
    res.on("close", function() {
        dom.dispose();
    });
    dom.on("error", function(error) {
        try {
            logger.writeUncaughtException(error);
            res.send(500, "Server Error");
        } catch (err) {
            console.error("Domain second error", err);
        }
        dom.dispose();
    });
    dom.run(function() {
        app(req, res);
    });
});
httpServer.on("error", function(error) {
    if(error.code != "EADDRINUSE") return;
    setTimeout(function() {
        httpServer.close();
        httpServer.listen(port);
    }, sc.reListen);
});
httpServer.listen(port);