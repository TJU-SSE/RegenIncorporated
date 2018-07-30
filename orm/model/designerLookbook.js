const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let DesignerLookbook = sequlize.define('designer_lookbook', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    rank: Sequlize.DOUBLE,
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = DesignerLookbook;
