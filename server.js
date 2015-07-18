var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
// Dependecies
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var config = require('./config/database.js');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

// Mongoose connect
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport);

// Middleware - Morgan
app.use(morgan('dev'));

// Parse every cookie
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext', saveUninitialized: true, resave: true, store: new MongoStore({mongooseConnection: mongoose.connection, ttl: 1 * 24 * 60 * 60})}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Test Middleware logggin for user info/session callback
/*app.use(function(req, res, next) {
    console.log(req.session);
    console.log("================");
    console.log(req.user);
    next();
});*/

// Set View Engine
app.set('view engine', 'ejs');
// API
var api = express.Router();
require('./app/routes/api.js')(api, passport);
app.use('/api', api);

var auth = express.Router();
require('./app/routes/auth.js')(auth, passport);
app.use('/auth', auth);

var secure = express.Router();
require('./app/routes/secure.js')(secure, passport);
app.use('/', secure);

// Express - default hm path
/*app.use('/', function(req, res) {
    res.send('Express Home - Hello World!');
    //console.log(req.cookies);
    //console.log('===============');
    //console.log(req.session);
});*/
// Old routes file before secure routes.js
//require('./app/routes.js')(app, passport);



// Server is running
app.listen(port);
console.log('Server Running on port: ' + port);
