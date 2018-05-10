'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('users',{
        id:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false,
            // autoIncrement: true,
            defaultValue:DataTypes.STRING
        },
        username:{
            type:DataTypes.STRING
        },
        password:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        age:{
            type:DataTypes.INTEGER
        },
        sex:{
            type:DataTypes.STRING
        },
        height:{
            type:DataTypes.STRING
        },
        weight:{
            type:DataTypes.STRING
        },
        country:{
            type:DataTypes.STRING
        },
        city:{
            type:DataTypes.STRING
        },
        badge:{
            type:DataTypes.STRING
        },
        privacy_age:{
            type:DataTypes.BOOLEAN,
            allowNull:true,
            defaultValue:true
        },
        privacy_weight:{
            type:DataTypes.BOOLEAN,
            allowNull:true,
            defaultValue:true
        },
        privacy_body:{
            type:DataTypes.BOOLEAN,
            allowNull:true,
            defaultValue:true
        },
        privacy_activity:{
            type:DataTypes.BOOLEAN,
            allowNull:true,
            defaultValue:true
        },
        created:{
            type:DataTypes.STRING
        },
        updated:{
            type:DataTypes.STRING
        }
    },{
        freezeTableName: false,
        timestamps: false,
    });

    return User;
};









