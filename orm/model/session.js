const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Session = sequlize.define('session', {
    id: {
        type: Sequlize.STRING(100),
        primaryKey: true
    },
    username: Sequlize.STRING(100)
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Session;
