const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let IndexProduct = sequlize.define('index_product', {
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

module.exports = IndexProduct;
