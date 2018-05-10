var express = require('express');
var router = express.Router();
var db = require('../../sqldb/index.js');
var User = db.User;
var UUID = require('uuid');
/*db.sequelize.transaction(function(){
    return User.findAll().then(function(result){
        console.log(result.rows)
    }).catch(function(err){
        console.log("Error:" + err);
    });
});*/

/*db.sequelize.query('SELECT  password,email FROM users').spread(function (results, metadata) {
console.log(results)
});*/
router.route('/user/login').get(function(req,res,next){
			if(req.cookies.userInfo){ 
			   req.session.userInfo = req.cookies.userInfo;
			}  
		  if(req.session.userInfo){
			res.locals.userInfo = req.session.userInfo;      
		  }
        if(req.session.userInfo){
            User.findOne({
                where:{id:req.session.userInfo.userId}
                ,raw: true
            }).then(function(result){
                if(result){
                    delete result.password;
                    res.json({state:100,data:{isLogin:true,userInfo:result}});
                    return;
                }
            }).catch(function(err){
                console.log("Error:" + err);
                res.json({state:500,data:{isLogin:false},msg:"Incorrect username or password"});
                return;
            });
        }else{
            res.json({state:200,data:{isLogin:false}});
        }
    }).post(function(req,res){
        let {email,password} = req.body;
        User.findOne({
            where:{email:email},
            raw: true
        }).then(function(result){
            if(result){
                if(password != result.password){
                    res.json({state:200,
                                data:{isLogin:false},
                                msg:"Incorrect username or password"
                            });
                    return;
                }
                delete result.password;
                req.session.userInfo={
                    email:result.email,
                    userId:result.id,
                    username:result.username
                };
				res.cookie('userInfo', 
						{email:result.email,
						userId:result.id,
						username:result.username},
						{
							maxAge: 900000 
						});
                res.json({state:100,data:{isLogin:true}});
                return;
            }else{
                res.json({state:200,
                            data:{isLogin:false},
                            msg:"Incorrect username or password"
                        });
                return;
            }
        }).catch(function(err){
            console.log("Error:" + err);
            res.json({state:200,
                        data:{isLogin:false},
                        msg:"Incorrect username or password"
                    });
            return;
        });

    });
router.route('/user/register')
    .get(function (req, res) {
        res.json({state:100,data:{isLogin:false}});
    })
    .post(function(req, res){
    let {username, password, email} = req.body;
        User.findOne({
                        where:{email:email},
                        raw: true
                    }).then(function(result){
                    if(!result){
                        User.create({id:UUID.v1(),username,password,email}).then(function (created) {
                            //req.session.email = created.email;
                            req.session.userInfo={
                                email:created.email,
                                userId:created.id,
                                username:created.username
                            };
							res.cookie('userInfo', 
										{email:created.email,
										userId:created.id,
										username:created.username},
										{
											maxAge: 900000 
										});
                            res.json({state:100,data:{
                                isLogin:true
                            }});
                        }).catch(function(err){
                            console.log("Error:" + err);
                            res.json({state:500});
                            return;
                        });
                    }else{
                        res.json({state:200,data:{},msg:'The mailbox has already existed'});
                    }
        }).catch(function(err){
            console.log("Error:" + err);
            res.json({state:500});
            return;
        });
});
router.route('/user/finishRegister')
    .post(function(req, res){
        let {username, age, sex, height, weight, country, city, badge} = req.body;

        User.update({username, age, sex, height, weight, country, city, badge},
                    {where:{id:req.session.userInfo.userId}})
                    .then(function (data) {
                        // console.log(data)
                        res.json({state:100,data:{
                            isLogin:true
                        }});
                    })
                    .catch(function(err){
                        console.log("Error:" + err);
                        res.json({state:500});
                        return;
                    });
    });
//privacy
router.route('/user/privacy').post(function(req, res){
    let {privacy_key} = req.body;
    User.update({[privacy_key]:req.body[privacy_key]},
        {where:{id:req.session.userInfo.userId}})
        .then(function (data) {
            res.json({state:100,data:{
                isLogin:true
            }});
        })
        .catch(function(err){
            console.log("Error:" + err);
            res.json({state:500});
            return;
        });
});
router.route('/user/logout').get(function(req, res){
    req.session.userInfo = null;
	res.clearCookie('userInfo');
    res.json({state:100});
});
//Access to user basic information
router.route('/user/people').get(function(req, res){
	let {id} = req.query;
	User.findOne({
		attributes:['id','username','country','city'],
		where:{
			id:id
		}
	}).then(function(results){
        if(!results){
            res.json({state:200,data:{}});
            return;
        }
		res.json({state:100,data:results});
	}).catch(function(err){
	  console.log("Error:" + err);
	  res.json({state:500});
	  return;
	});
});


module.exports = router;