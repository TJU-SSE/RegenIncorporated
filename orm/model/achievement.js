const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Achievement = sequlize.define('achievement', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    rank: Sequlize.DOUBLE
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Achievement;
