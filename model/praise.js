'use strict'
module.exports = function(sequelize,DataTypes){
    var Praise = sequelize.define('praise',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement: true,
            defaultValue:DataTypes.INTEGER
        },
        pid:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        num:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },{
        freezeTableName: true,
        timestamps: false,
    });
    return Praise;
};









