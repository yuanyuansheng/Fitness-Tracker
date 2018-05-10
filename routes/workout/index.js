var express = require('express');
var router = express.Router();
var db = require('../../sqldb/index.js');
var Workout = db.Workout;
var User = db.User;
var UUID = require('uuid');
router.route('/workout').post(function(req, res){
    let { exercise_type,workout_weight, workout_reps,date} = req.body;
    if(req.session.userInfo){
        let params ={id:UUID.v1(),
            user_id:req.session.userInfo.userId,
			username:req.session.userInfo.username,
            workout_type:exercise_type,
            workout_weight,
            workout_reps,
            date:date};//upsert
        Workout.create(params).then(function (created) {
            res.json({state:100});
        }).catch(function(err){
            console.log("Error:" + err);
            res.json({state:500});
            return;
        });
    }else{
        res.json({state:200,msg:'Not logged in'});
    }


});


router.route('/workout/getAllData').get(function(req, res){
    let { userId =''} = req.query;
    if(req.session.userInfo){

        if(!!userId){
            User.findOne({
                attributes:["privacy_activity"],
                where:{
                    id:userId
                }
            }).then((results)=>{
                if(!results.privacy_activity){
                        Workout.findAll({
                            where:{
                                user_id:userId
                            }
                            }).then(function (projects) {
                                res.json({state:100,data:projects});
                            }).catch(function(err){
                                console.log("Error:" + err);
                                res.json({state:500});
                                return;
                        });
                }else{
                        res.json({state:100,data:[]});
                }
            }).catch(function(err){
                console.log("Error:" + err);
                res.json({state:500});
                return;
            });

        }else{

             Workout.findAll({
                where:{
                    user_id:req.session.userInfo.userId
                }
                }).then(function (projects) {
                    res.json({state:100,data:projects});
                }).catch(function(err){
                    console.log("Error:" + err);
                    res.json({state:500});
                    return;
                });
        }

        


    }else{
        res.json({state:200,msg:'Not logged in'});
    }


});


module.exports = router;