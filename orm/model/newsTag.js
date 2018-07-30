const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let NewsTag = sequlize.define('news_tag', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = NewsTag;
