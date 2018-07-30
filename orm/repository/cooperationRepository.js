const Cooperation = require('../model/cooperation');
const PortfolioRepository = require('./portfolioRepository');

let pub = {};

pub.findAll = async () => {
    let res = await Cooperation.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await Cooperation.findOne({where: filter});
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Cooperation.findAll(filter);
    return res;
};

pub.findPortfolio = async (cooperation) => {
    return await cooperation.getPortfolio();
};

pub.create = async (title, releaseTime, description, portfolio) =>{
    let cooperation = await Cooperation.create({ title: title, releaseTime: releaseTime, description: description});
    cooperation.setPortfolio(portfolio);
    return cooperation;
};

pub.updatePortfolio = async (cooperation, portfolio) => {
    let oldPortfolio = await cooperation.getPortfolio();
    PortfolioRepository.delete(oldPortfolio);
    cooperation.setPortfolio(portfolio);
};

pub.update = async (cooperation, title, releaseTime, description) => {
    if (title) cooperation.title = title;
    if (releaseTime) cooperation.releaseTime = releaseTime;
    if (description) cooperation.description = description;
    await cooperation.save();
};

pub.deleteOne = async (filter) => {
    let cooperation = await pub.findOne(filter);
    await pub.delete(cooperation);
};

pub.delete = async (cooperation) => {
    if (cooperation) {
        let portfolio = await cooperation.getPortfolio();
        await PortfolioRepository.delete(portfolio);
        await cooperation.destroy();
    }
};

module.exports = pub;
