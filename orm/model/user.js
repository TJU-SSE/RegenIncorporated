const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let User = sequlize.define('user', {
    username: {
        type: Sequlize.STRING(100),
        primaryKey: true
    },
    password: Sequlize.STRING(100)
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = User;
