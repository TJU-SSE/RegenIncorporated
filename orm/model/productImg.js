const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let ProductImg = sequlize.define('product_img', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = ProductImg;
