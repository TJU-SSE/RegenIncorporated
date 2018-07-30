const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let ProductTag = sequlize.define('product_tag', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = ProductTag;
