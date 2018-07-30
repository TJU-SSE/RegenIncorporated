const Lookbook = require('../model/lookbook');
const PortfolioRepository = require('./portfolioRepository');

let pub = {};

pub.findAll = async () => {
    let res = await Lookbook.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await Lookbook.findOne({where: filter});
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Lookbook.findAll(filter);
    return res;
};

pub.findPortfolio = async (lookbook) => {
    return await lookbook.getPortfolio();
};

pub.create = async (title, releaseTime, description, portfolio) =>{
    let lookbook = await Lookbook.create({ title: title, releaseTime: releaseTime, description: description});
    lookbook.setPortfolio(portfolio);
    return lookbook;
};

pub.updatePortfolio = async (lookbook, portfolio) => {
    let oldPortfolio = await lookbook.getPortfolio();
    PortfolioRepository.delete(oldPortfolio);
    lookbook.setPortfolio(portfolio);
};

pub.update = async (lookbook, title, releaseTime, description) => {
    if (title) lookbook.title = title;
    if (releaseTime) lookbook.releaseTime = releaseTime;
    if (description) lookbook.description = description;
    await lookbook.save();
};

pub.deleteOne = async (filter) => {
    let lookbook = await pub.findOne(filter);
    await pub.delete(lookbook);
};

pub.delete = async (lookbook) => {
    if (lookbook) {
        let portfolio = await lookbook.getPortfolio();
        await PortfolioRepository.delete(portfolio);
        await lookbook.destroy();
    }
};

module.exports = pub;
