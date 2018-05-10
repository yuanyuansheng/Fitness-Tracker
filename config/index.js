
'use strict'
var all = {
    sequelize:{
        username: 'postgres',
        password: 'qwerqwer',
        database: 'postgres',
        host: "localhost",
        dialect: 'postgres',
        define: {
            underscored: false,
            timestamps: true,
            paranoid: true
        }
    }
};

module.exports = all;





