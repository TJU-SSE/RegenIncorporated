const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Photography = sequlize.define('photography', {
  id: {
    type: Sequlize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: Sequlize.STRING(100),
  introduction: Sequlize.STRING(1000),
  title_cn: Sequlize.STRING(100),
  introduction_cn: Sequlize.STRING(1000),
  cover_url: Sequlize.STRING(500),
  banner: {
    type: Sequlize.BOOLEAN,
    defaultValue: false
  },
  banner_rank: {
    type: Sequlize.BIGINT,
    defaultValue: 0
  }

}, {
    freezeTableName: true,
    timestamps: true,
  });

module.exports = Photography;