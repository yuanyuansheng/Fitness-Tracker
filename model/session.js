'use strict'
module.exports = function(sequelize,DataTypes){
    var Session = sequelize.define('session',{
        sid:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false
        },
        sess:{
            type:DataTypes.JSON,
            allowNull:false
        },
        expire:{
            type:DataTypes.TIME,
            allowNull:false
        }
    },{
        freezeTableName: true,
        timestamps: true,
    });
    return Session;
};









