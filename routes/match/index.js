var express = require('express');
var router = express.Router();
var db = require('../../sqldb/index.js');
var UUID = require('uuid');
var Sequelize = require('sequelize');
var User = db.User;
var Match = db.Match;
var Match_detail = db.Match_detail;
Match.hasMany(Match_detail,{ as:"match_detail",foreignKey:'match_id',targetKey:'id'});
Match_detail.belongsTo(User, {foreignKey: "user_id"});
router.route('/match/createMatch').post(function(req, res){
    let {
        match_title,
        match_description,
        match_content,
        /*start_time,
        end_time,*/
        match_type,
        team1=null,
        team2=null
    } = req.body;
    if(req.session.userInfo){
        Match.create({
            id:UUID.v1(),
            create_user_id:req.session.userInfo.userId,
            match_title,
            match_description,
            match_content,
           /* start_time,
            end_time,*/
            match_type,
            match_team1:team1,
            match_team2:team2
        }).then(function (created) {
            Match_detail.create({
                id:UUID.v1(),
                match_id:created.id,
                user_id:req.session.userInfo.userId,
                match_team:team1
            }).then(()=>{
                res.json({state:100});
            });
        }).catch(function(err){
            console.log("Error:" + err);
            res.json({state:500,msg:err});
            return;
        });
    }else{
        res.json({state:200,data:{isLogin:false}});
    }
});
router.route('/match/getAllData').get(function (req, res) {
    let {matchType} = req.query;
    Match.findAll({
        where:{
            match_type:matchType
        },
        include:[
            {
                model:Match_detail,
                as:'match_detail'
            }
        ],
        'order': [['createdAt', 'DESC']]//DESC  ASC
    }).then(function(results){
        res.json({state:100,data:results});
    }).catch(function(err){
        console.log("Error:" + err);
        res.json({state:500});
        return;
    });
});
router.route('/match/joinCompetition').post(function (req,res) {
    let {id, create_user_id, team=null} = req.body;
    if(create_user_id === req.session.userInfo.userId){
        res.json({state:200,msg:'Have taken part in'});
        return;
    }
    Match_detail.findAll({
        where:{
            match_id:id
        }
    }).then((results)=> {
        let resultsJSON = Array.prototype.slice.call(results,0);
        if(resultsJSON.length >=2){
            res.json({state:200,msg:"Expired"});
            return;
        }
        Match.update({
            match_state:"O",
        },{
            where:{
                id:id
            }
        }).then(()=>{
            Match_detail.create({
                id:UUID.v1(),
                match_id:id,
                user_id:req.session.userInfo.userId,
                match_team:team
            }).then(()=>{
                res.json({state:100});
            })
        });
    });
});
router.route('/match/checkTeamBattle').post(function (req,res) {
    let {id, create_user_id} = req.body;
    if(create_user_id === req.session.userInfo.userId){
        res.json({state:200,msg:'Have taken part in'});
        return;
    }
    Match_detail.findAll({
        where:{
            match_id:id
        }
    }).then((results)=> {
        let resultsJSON = Array.prototype.slice.call(results, 0);
        if (resultsJSON.length >= 4) {
            res.json({state: 200, msg: "Expired",data:resultsJSON});
            return;
        }
        for(let i =0;i <resultsJSON.length;i++){
            if(resultsJSON[i].user_id ===  req.session.userInfo.userId){
                res.json({state:200,msg:'Have taken part in'});
                return;
            }
        }
        Match.findOne({
            where:{
                id:id
            },
            include:[
                {
                    model:Match_detail,
                    as:'match_detail',
                    include:[{
                        attributes:["username","country","city"],
                        model:User
                    }]
                }
            ],
            'order': [['createdAt', 'DESC']]//DESC  ASC
        }).then(function(results){
            res.json({state:100,data:results});
        }).catch(function(err){
            console.log("Error:" + err);
            res.json({state:500});
            return;
        });
    })
});
router.route('/match/joinTeamBattle').post(function (req,res) {
    let {id , team=null} = req.body;
    Match_detail.findAll({
        where:{
            match_id:id
        }
    }).then((results)=> {
        let resultsJSON = Array.prototype.slice.call(results,0);
        if(resultsJSON.length >=4){
            res.json({state:200,msg:"Expired"});
            return;
        }
        for(let i =0;i <resultsJSON.length;i++){
            if(resultsJSON[i].user_id ===  req.session.userInfo.userId){
                res.json({state:200,msg:'Have taken part in'});
                return;
            }
        }
        Match.update({
            match_state:"O",
        },{
            where:{
                id:id
            }
        }).then(()=>{
            Match_detail.findOrCreate({
                defaults:{
                    id:UUID.v1(),
                    match_id:id,
                    user_id:req.session.userInfo.userId,
                    match_team:team
                },
                where:{
                    user_id:req.session.userInfo.userId,
                    match_id:id
                }
            }).then(()=>{
                res.json({state:100});
            })
        });
    });
});
router.route('/match/myMatching').get(function (req,res) {
    if(req.session.userInfo){
        Match_detail.findAll({
            where:{
                user_id:req.session.userInfo.userId
            }
        }).then((results)=>{
            let resultsJSON = Array.prototype.slice.call(results,0);
            let matchArr =[];
            resultsJSON.forEach((item)=>{
                matchArr.push(item.match_id)
            });
            Match.findAll({
                where:{
                    match_state:"O",
                    id:{
                        $in:matchArr
                    }
                },
                include:[
                    {
                        model:Match_detail,
                        as:'match_detail',
                        include:[{
                            attributes:["username","country","city"],
                            model:User
                        }]
                    }
                ],
                'order': [['createdAt', 'DESC']]//DESC  ASC
            }).then(function(results){
                res.json({state:100,data:results});
            }).catch(function(err){
                console.log("Error:" + err);
                res.json({state:500});
                return;
            });
        });
    }else{
        res.json({state:500});
    }
});
router.route('/match/updateScore').post(function (req,res) {
    let {id,reps} = req.body;
    if(req.session.userInfo){
        Match_detail.update({
            match_score:reps,
        },{
            where:{
                match_id:id,
                user_id:req.session.userInfo.userId
            }
        }).then(()=>{
            Match_detail.findAll({
                where:{
                    match_id:id
                },
            }).then((results)=>{
                let resultsJSON = Array.prototype.slice.call(results,0);
                let isEnd = resultsJSON.every(function (item) {
                    return item.match_score;
                });
                if(!isEnd){
                    res.json({state:100});
                    return;
                }
                let updateDetail =  function (idx) {
                    return new Promise((resolve,reject)=>{
                        Match_detail.update({
                            match_result:resultsJSON[idx].match_score > resultsJSON[1-idx].match_score?
                                "win": resultsJSON[idx].match_score == resultsJSON[1-idx].match_score?"drew":"lost",
                        },{
                            where:{
                                match_id:resultsJSON[idx].match_id,
                                user_id:resultsJSON[idx].user_id
                            }
                        }).then(()=>{
                            resolve();
                        })

                    })
                };
             let updateMatch =function () {
                 return new Promise((resolve,reject)=>{
                     Match.update({
                         match_state:"E"
                     },{
                         where:{
                             id:id
                         }
                     }).then(()=>{
                         resolve();
                     })
                 })
             };
            Promise.all([updateDetail(0),updateDetail(1),updateMatch()]).then(()=>{
                res.json({state:100});
            })
            });

        });
    }else{
        res.json({state:200,msg:'Not logged in'});
    }

});
router.route('/match/updateTeamBattleScore').post(function (req,res) {
    let {id,reps} = req.body;
    if(req.session.userInfo){
        Match_detail.update({
            match_score:reps,
        },{
            where:{
                match_id:id,
                user_id:req.session.userInfo.userId
            }
        }).then(()=>{
            Match_detail.findAll({
                where:{
                    match_id:id
                },
            }).then((results)=>{
                let resultsJSON = Array.prototype.slice.call(results,0);

                if(resultsJSON.length <=3){
                    res.json({state:100});
                    return;
                }
                let isEnd = resultsJSON.every(function (item) {
                    return item.match_score;
                });
                if(!isEnd){
                    res.json({state:100});
                    return;
                }
                let updateDetail =  function (obj,result) {
                    return new Promise((resolve,reject)=>{
                        Match_detail.update({
                            match_result:result,
                        },{
                            where:{
                                match_id:obj.match_id,
                                user_id:obj.user_id
                            }
                        }).then(()=>{
                            resolve();
                        })

                    })
                };
                let team = {};
                resultsJSON.forEach((item)=>{
                    if(!team[item.match_team]){
                        team[item.match_team] ={};
                        team[item.match_team]["team"] =[];
                        team[item.match_team]["score"] =0;
                    }
                    team[item.match_team]["score"] +=item.match_score;
                    team[item.match_team]["team"].push(item);
                });
                let teamScore=[];
                for(let k in team){
                    teamScore.push({score:team[k]['score'],teamName:k})
                }
                let teamUpdate =[];
                if(teamScore[0]['score'] > teamScore[1]['score']){
                    teamUpdate.push(updateDetail(team[teamScore[0]["teamName"]]["team"][0],"win"))
                    teamUpdate.push(updateDetail(team[teamScore[0]["teamName"]]["team"][1],"win"))
                    teamUpdate.push(updateDetail(team[teamScore[1]["teamName"]]["team"][0],"lost"))
                    teamUpdate.push(updateDetail(team[teamScore[1]["teamName"]]["team"][1],"lost"))
                }else{
                    if(teamScore[0]['score'] === teamScore[1]['score']){
                        teamUpdate.push(updateDetail(team[teamScore[0]["teamName"]]["team"][0],"drew"))
                        teamUpdate.push(updateDetail(team[teamScore[0]["teamName"]]["team"][1],"drew"))
                        teamUpdate.push(updateDetail(team[teamScore[1]["teamName"]]["team"][0],"drew"))
                        teamUpdate.push(updateDetail(team[teamScore[1]["teamName"]]["team"][1],"drew"))
                    }else{
                        teamUpdate.push(updateDetail(team[teamScore[1]["teamName"]]["team"][0],"win"))
                        teamUpdate.push(updateDetail(team[teamScore[1]["teamName"]]["team"][1],"win"))
                        teamUpdate.push(updateDetail(team[teamScore[0]["teamName"]]["team"][0],"lost"))
                        teamUpdate.push(updateDetail(team[teamScore[0]["teamName"]]["team"][1],"lost"))
                    }
                }
                let updateMatch =function () {
                    return new Promise((resolve,reject)=>{
                        Match.update({
                            match_state:"E"
                        },{
                            where:{
                                id:id
                            }
                        }).then(()=>{
                            resolve();
                        })
                    })
                };
                teamUpdate.push(updateMatch());
                Promise.all(teamUpdate).then(()=>{
                    res.json({state:100});
                })
            });

        });
    }else{
        res.json({state:200,msg:'Not logged in'});
    }

});
router.route('/match/history').get(function (req,res) {
    if(req.session.userInfo){
        Match_detail.findAll({
            where:{
                user_id:req.session.userInfo.userId,
                match_result:{
                    $in: ["win","lost","drew"]
                }
            }
        }).then((results)=>{
            let resultsJSON = Array.prototype.slice.call(results,0);
            let matchArr =[];
            resultsJSON.forEach((item)=>{
                matchArr.push(item.match_id)
            });
            Match.findAll({
                include:[
                    {
                        model:Match_detail,
                        as:'match_detail',
                        include:[{
                            attributes:["username"],
                            model:User
                        }]
                    }
                ],
                where:{
                    id:{
                        $in:matchArr
                    },
                    match_state:"E"
                },
                order:[['createdAt', 'DESC']]//DESC  ASC
            }).then(function(results){
                res.json({state:100,data:results});
            }).catch(function(err){
                console.log("Error:" + err);
                res.json({state:500});
                return;
            });
        });
    }else{
        res.json({state:200,msg:'Not logged in'});
    }
});
module.exports = router;