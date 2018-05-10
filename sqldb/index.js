
'use strict'
var config = require('../config');
var Sequelize = require('sequelize');
var db = {
    sequelize:new Sequelize(config.sequelize.database,config.sequelize.username,config.sequelize.password,config.sequelize)
};
db.User = db.sequelize.import('../model/user.js');
db.Praise = db.sequelize.import('../model/praise.js');
db.Workout = db.sequelize.import('../model/workout.js');
db.Session = db.sequelize.import('../model/session.js');
db.Track_body = db.sequelize.import('../model/track_body.js');
db.Match = db.sequelize.import('../model/match.js');
db.Match_detail = db.sequelize.import('../model/match_detail.js');
module.exports = db;







