const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let ShowLink = sequlize.define('show_link', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    rank: Sequlize.BIGINT
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = ShowLink;
