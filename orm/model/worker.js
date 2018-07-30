const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Worker = sequlize.define('worker', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequlize.STRING(100),
    email: Sequlize.STRING(100),
    identity: Sequlize.STRING(100),
    rank: Sequlize.DOUBLE
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Worker;
