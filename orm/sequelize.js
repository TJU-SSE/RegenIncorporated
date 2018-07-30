const Sequelize = require('sequelize');
const config = require('../utils/config');

let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    dialectOptions: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    },

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // 仅 SQLite 适用
    // storage: 'path/to/database.sqlite'
});

module.exports = sequelize;
