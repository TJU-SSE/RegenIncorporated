const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Show = sequlize.define('show', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequlize.STRING(100),
    year: Sequlize.STRING(100),
    season: Sequlize.STRING(100),
    desc: Sequlize.STRING(5000),
    rank: Sequlize.DOUBLE
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Show;
