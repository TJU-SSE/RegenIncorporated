const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Portfolio = sequlize.define('portfolio', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Portfolio;
