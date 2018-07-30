const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let ArtistProduct = sequlize.define('artist_product', {
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

module.exports = ArtistProduct;
