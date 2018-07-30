const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Cooperation = sequlize.define('cooperation', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    title: Sequlize.STRING(100),
    releaseTime: Sequlize.BIGINT,
    description: Sequlize.STRING(10000),
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Cooperation;
