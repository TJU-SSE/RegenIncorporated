const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Season = sequlize.define('season', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    year: Sequlize.STRING(32),
    season: Sequlize.STRING(32),
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Season;
