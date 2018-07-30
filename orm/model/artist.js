const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Artist = sequlize.define('artist', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequlize.STRING(100),
    identity: Sequlize.STRING(1000),
    social: Sequlize.STRING(1000),
    address: Sequlize.STRING(1000),
    extraBiography: Sequlize.STRING(5000),
    biography: Sequlize.STRING(5000),
    viewcount: Sequlize.BIGINT
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Artist;
