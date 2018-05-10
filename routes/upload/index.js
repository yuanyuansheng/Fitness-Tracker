var express = require('express');
var router = express.Router();
var fs = require("fs");
var db = require('../../sqldb/index.js');
var Track_img = db.Track_img;
var UUID = require('uuid');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb){
        var fileformat = (file.originalname).split(".");
        cb(null, Date.now()+"."+fileformat[fileformat.length - 1]);
    }
});
var upload = multer({
    storage: storage
});
router.route('/upload/bodyImg').post(upload.single('file'),function(req, res){
    let filename = req.file.filename;
    if(req.session.userInfo){
        let params ={id:UUID.v1(),
            // track_id:req.session.userInfo.userId,
            track_img:filename
            };//upsert
        res.json({state:100,data:{urlImg:"http://"+req.headers.host+"/uploads/"+filename}});
        /*Track_img.create(params).then(function (created) {
            res.json({state:100,data:{urlImg:"http://"+req.headers.host+"/uploads/"+filename,id:created.id}});
        }).catch(function(err){
            console.log("Error: " + err);
            res.json({state:500});
            return;
        });*/
    }else{
        res.json({state:200,msg:'Not logged in'});
    }

});


module.exports = router;