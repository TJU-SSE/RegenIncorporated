const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Test = sequlize.define('test', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequlize.STRING(1000),
    url: Sequlize.STRING(1000),
    age: Sequlize.BIGINT
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Test;
