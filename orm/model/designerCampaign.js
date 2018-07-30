const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let DesignerCampaign = sequlize.define('designer_campaign', {
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

module.exports = DesignerCampaign;
