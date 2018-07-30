const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let News = sequlize.define('news', {
  id: {
    type: Sequlize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: Sequlize.STRING(100),
  writer: Sequlize.STRING(100),
  content: Sequlize.STRING(10000),
  time: Sequlize.STRING(100),
  viewcount: Sequlize.BIGINT,
}, {
  freezeTableName: true,
  timestamps: true,
});

module.exports = News;