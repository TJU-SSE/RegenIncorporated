const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let PhotographyImg = sequlize.define('photography_img', {
  id: {
    type: Sequlize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  rank: {
    type: Sequlize.BIGINT,
    defaultValue: 0
  }
}, {
    freezeTableName: true,
    timestamps: true,
  });

module.exports = PhotographyImg;
