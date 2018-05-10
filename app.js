var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 8080;
var app = express();
var index = require('./routes/index/index');
var user = require('./routes/user/index');
var workout = require('./routes/workout/index');
var upload = require('./routes/upload/index');
var track = require('./routes/track/index');
var match = require('./routes/match/index');
require('./common/init');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
var moment = require('moment');
moment.locale('zh-cn');
app.locals.moment = moment; // definition all project use this moment
app.use(cookieParser('schedule'));
var sqldb = require('./sqldb');
sqldb.sequelize.sync({force: false}).then(function() {
	console.log("Server successed to start");
}).catch(function(err){
	console.log("Server failed to start due to error: %s", err);
});
var sessionOptions = {
	secret: "schedule",
	resave : true,
	saveUninitialized : false
};
app.use(session(sessionOptions));
app.listen(port, () => {
	console.log('server running on port: ' + port);
});
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	// console.log("user in session:"+req.session.user)
	var _user = req.session.user;
	if(_user){
		res.locals.user = _user;
	}
	next();
});
app.use((err, req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})
// index route
app.use('/', index);
app.use('/', user);
app.use('/', workout);
app.use('/', upload);
app.use('/', track);
app.use('/', match);

