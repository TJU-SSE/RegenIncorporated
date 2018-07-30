const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Contact = sequlize.define('contact', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    phone: Sequlize.STRING(100),
    photography: Sequlize.STRING(1000),
    fax: Sequlize.STRING(100),
    address: Sequlize.STRING(1000),
    link: Sequlize.STRING(1000),
    social: Sequlize.STRING(5000),
    desc: Sequlize.STRING(5000)
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Contact;
