var express = require('express');
var router = express.Router();
var db = require('../../sqldb/index.js');
var Track_body = db.Track_body;
var User = db.User;
var UUID = require('uuid');
router.route('/track/track_body').post(function(req, res){
    let { waist_size, chest_size, hip_size, arm_size, date,img_url=[]} = req.body;
    if(req.session.userInfo){
        let options ={
                        defaults:{
                        id:UUID.v1(),
                        user_id:req.session.userInfo.userId,
                        waist_size:waist_size?waist_size:0,
                        chest_size:chest_size?chest_size:0,
                        hip_size:hip_size?hip_size:0,
                        arm_size:arm_size?arm_size:0,
                        date:date,
                        img_url:img_url},
                        where:{user_id:req.session.userInfo.userId,date:date}
                        };//upsert  create
        Track_body.findOrCreate(options).then(function (Instance,created) {//This parameter is added or modified, true added, false modified.
            if(created){
                res.json({state:100});
            }else {
                var params ={};
                if(waist_size){
                    params['waist_size'] =waist_size
                }
                if(chest_size){
                    params['chest_size'] =chest_size
                }
                if(hip_size){
                    params['hip_size'] =hip_size
                }
                if(arm_size){
                    params['arm_size'] =arm_size
                }
                if(img_url.length > 0){
                    params['img_url'] =img_url
                }

                Track_body.update(params,
                    {
                        where:{user_id:req.session.userInfo.userId,date:date}

                    }).then(function (results) {
                        res.json({state:100});
                    })
            }


        }).catch(function(err){
            console.log("Error:" + err);
            res.json({state:500});
            return;
        });
    }else{
        res.json({state:200,msg:'Not logged in'});
    }


});

//Data within 7 days of the chart
router.route('/track/getTrackData').get(function(req, res){
    let {startDate, endDate,track_type, userId=""} = req.query;
	// console.log(startDate)
    if(req.session.userInfo){
			Track_body.findAll({
				attributes: [[track_type,'value'],'date'],
				where:{
					date: {
						$lt: endDate,
						$gt: startDate
					},
					// [track_type]:track_type,
					user_id:userId || req.session.userInfo.userId
				},
				'order': [['date', 'ASC']]//DESC
			}).then(function(results){
				res.json({state:100,data:results});
			}).catch(function(err){
			  console.log("Error:" + err);
			  res.json({state:500});
			  return;
			});
           
   
    }else{
        res.json({state:200,msg:'Not logged in'});
    }


});
//Get all data of the user
router.route('/track/getAllTrackData').get(function(req, res){
    let { userId =''} = req.query;
    if(req.session.userInfo){
        if(!!userId){
            User.findOne({
                attributes:["privacy_body"],
                where:{
                    id:userId
                }
            }).then((results)=>{
                if(!results.privacy_body){
                    Track_body.findAll({
                        where:{
                            user_id:userId
                        },
                        order:[["createdAt","DESC"]]
                    }).then(function(results){
                        res.json({state:100,data:results});
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
            Track_body.findAll({
                where:{
                    user_id:req.session.userInfo.userId
                },
                order:[["createdAt","DESC"]]
            }).then(function(results){
                res.json({state:100,data:results});
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
router.route('/track/removeTrackItem').delete(function(req, res){
    let {id,track_type} = req.query;
    if(req.session.userInfo){
            Track_body.update({
                [track_type]:0,
            },{
                where:{
                      id:id,
                    user_id:req.session.userInfo.userId
                },
            }).then(function(results){
                res.json({state:100,data:track_type});
            }).catch(function(err){
              console.log("Error:" + err);
              res.json({state:500});
              return;
            });
    }else{
        res.json({state:200,msg:'Not logged in'});
    }
});



module.exports = router;