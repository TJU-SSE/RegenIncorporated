const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Tag = sequlize.define('tag', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    title: Sequlize.STRING(100)
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Tag;
