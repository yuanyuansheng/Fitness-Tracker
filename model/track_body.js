'use strict'
module.exports = function (sequelize, DataTypes) {
    var Track_body = sequelize.define('track_body', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            /* autoIncrement: true,*/
            defaultValue: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        waist_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        chest_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        arm_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hip_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        img_url: {
            allowNull: true,
            type: DataTypes.JSON
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: false,
        timestamps: true,
    });
    return Track_body;
};









