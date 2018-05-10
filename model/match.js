'use strict'
module.exports = function(sequelize,DataTypes){
    var Match = sequelize.define('match',{
        id:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false
        },
        create_user_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
        match_title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        match_description:{
            type:DataTypes.STRING,
            allowNull:false
        },
        match_content:{
            type:DataTypes.STRING,
            allowNull:false
        },
        match_state:{
            type:DataTypes.STRING,//N O E
            allowNull:true,
            defaultValue:"N",
            values: ["N","O","E"]
        },
        match_team1:{
            type:DataTypes.STRING,
            allowNull:true
        },
        match_team2:{
            type:DataTypes.STRING,
            allowNull:true
        },
        /*start_time:{
            type:DataTypes.DATE,
            allowNull:true
        },
        end_time:{
            type:DataTypes.DATE,
            allowNull:true
        },*/
        match_type:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        }
    },{
        freezeTableName: false,
        timestamps: true,
    });
    return Match;
};









