const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let DesignerCooperation = sequlize.define('designer_cooperation', {
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

module.exports = DesignerCooperation;
