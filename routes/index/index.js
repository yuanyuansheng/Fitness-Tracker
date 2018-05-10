var express = require('express');
var router = express.Router();
var db = require('../../sqldb/index.js');
var User = db.User;
var Workout = db.Workout;
var Sequelize = require('sequelize');
router.route('/index/ranking').get(function(req, res){
	if(req.session.userInfo){
		Workout.findAll({
			attributes:['user_id',
			[Sequelize.fn('SUM', Sequelize.col('workout_weight')), 'sum'],'username'],
			group:['user_id','username'],
			limit:10,
			order: [[Sequelize.literal("sum DESC")]],
			raw:true})
		.then(function(result){
			 // console.log(result);
			if(result){
				res.json({state:100,data:result});
				return;
			}
		}).catch(function(err){
			console.log("Error:" + err);
			res.json({state:500,msg:"Incorrect username or password"});
			return;
		});
		 /* User.findAll({
			attributes: ['id','username'],
			include:[{model:Workout,attributes:['workout_weight'],
					association:User.hasMany(Workout, {foreignKey:'user_id', targetKey:'id'})}]
		}).then(function(result){
			// let {username} = result;
			if(result){
				res.json({state:100,data:result});
				return;
			}
		}).catch(function(err){
			console.log("Error:" + err);
			res.json({state:500,msg:"Incorrect username or password"});
			return;
		}); */
		
	}else{
		res.json({state:200,data:{isLogin:false}});
	}
		
})


router.route('/index/ownRanking').get(function(req, res){
	if(req.session.userInfo){
		Workout.findOne({
			attributes:['user_id',
			[Sequelize.fn('SUM', Sequelize.col('workout_weight')), 'sum'],'username'],
			group:['user_id','username'],
			where:{
				user_id:req.session.userInfo.userId
			},
			raw:true})
		.then(function(result){
			 // console.log(result);
			if(result){
				res.json({state:100,data:result});
				return;
			}
		}).catch(function(err){
			console.log("Error:" + err);
			res.json({state:500,msg:"Incorrect username or password"});
			return;
		});
	}else{
		res.json({state:200,data:{isLogin:false}});
	}
		
})

module.exports = router;