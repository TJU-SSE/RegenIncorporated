const Branding = require('../model/branding');
const PortfolioRepository = require('./portfolioRepository');

let pub = {};

pub.findAll = async () => {
    let res = await Branding.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await Branding.findOne({where: filter});
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Branding.findAll(filter);
    return res;
};

pub.findPortfolio = async (branding) => {
    return await branding.getPortfolio();
};

pub.create = async (title, releaseTime, description, portfolio) =>{
    let branding = await Branding.create({ title: title, releaseTime: releaseTime, description: description});
    branding.setPortfolio(portfolio);
    return branding;
};

pub.updatePortfolio = async (branding, portfolio) => {
    let oldPortfolio = await branding.getPortfolio();
    PortfolioRepository.delete(oldPortfolio);
    branding.setPortfolio(portfolio);
};

pub.update = async (branding, title, releaseTime, description) => {
    if (title) branding.title = title;
    if (releaseTime) branding.releaseTime = releaseTime;
    if (description) branding.description = description;
    await branding.save();
};

pub.deleteOne = async (filter) => {
    let branding = await pub.findOne(filter);
    await pub.delete(branding);
};

pub.delete = async (branding) => {
    if (branding) {
        let portfolio = await branding.getPortfolio();
        await PortfolioRepository.delete(portfolio);
        await branding.destroy();
    }
};

module.exports = pub;
