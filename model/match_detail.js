'use strict'
module.exports = function(sequelize,DataTypes){
    var Match_detail = sequelize.define('match_detail',{
        id:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false
        },
        match_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
        user_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
        match_team:{
            type:DataTypes.STRING,
            allowNull:true
        },
        match_score:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        match_result:{
            type:DataTypes.STRING,
            allowNull:true,
            values: ["win","lost","drew"]
        }
    },{
        freezeTableName: false,
        timestamps: true,
    });
    return Match_detail;
};









