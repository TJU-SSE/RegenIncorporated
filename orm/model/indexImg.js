const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let IndexImg = sequlize.define('index_img', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    rank: Sequlize.DOUBLE
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = IndexImg;
