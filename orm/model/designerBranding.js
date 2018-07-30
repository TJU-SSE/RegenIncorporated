const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let DesignerBranding = sequlize.define('designer_branding', {
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

module.exports = DesignerBranding;
