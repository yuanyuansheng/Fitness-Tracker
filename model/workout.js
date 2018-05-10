'use strict'
module.exports = function(sequelize,DataTypes){
    var Workout = sequelize.define('workout',{
        id:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false,
           /* autoIncrement: true,*/
            
        },
        user_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
		username:{
            type:DataTypes.STRING,
            allowNull:false,
			defaultValue:''
        },
        workout_type:{
            type:DataTypes.STRING,
            allowNull:false,
			defaultValue:''
        },
        workout_weight:{
            type:DataTypes.INTEGER,
            allowNull:false,
			defaultValue:0
        },
        workout_reps:{
            type:DataTypes.INTEGER,
            allowNull:false,
			defaultValue:0
        },
        date:{
            type:DataTypes.STRING,
            allowNull:true
        }
    },{
        freezeTableName: false,
        timestamps: true,
    });
    return Workout;
};









