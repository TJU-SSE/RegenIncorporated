const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Config = sequlize.define('config', {
    id: {
        type: Sequlize.STRING(256),
        primaryKey: true
    },
    content: Sequlize.STRING(2048),
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Config;
