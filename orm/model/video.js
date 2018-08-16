const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Video = sequlize.define('video', {
  id: {
    type: Sequlize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: Sequlize.STRING(100),
  desc: Sequlize.STRING(10000),
  intro: Sequlize.STRING(10000),
  title_cn: Sequlize.STRING(100),
  desc_cn: Sequlize.STRING(10000),
  intro_cn: Sequlize.STRING(10000),
  cover: Sequlize.STRING(500),
  video: Sequlize.STRING(500),
  rank: Sequlize.DOUBLE
  
}, {
    freezeTableName: true,
    timestamps: true,
  });

module.exports = Video;