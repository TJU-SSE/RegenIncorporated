const Campaign = require('../model/campaign');
const PortfolioRepository = require('./portfolioRepository');

let pub = {};

pub.findAll = async () => {
    let res = await Campaign.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await Campaign.findOne({where: filter});
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Campaign.findAll(filter);
    return res;
};

pub.findPortfolio = async (campaign) => {
    return await campaign.getPortfolio();
};

pub.create = async (title, releaseTime, description, portfolio) =>{
    let campaign = await Campaign.create({ title: title, releaseTime: releaseTime, description: description});
    campaign.setPortfolio(portfolio);
    return campaign;
};

pub.updatePortfolio = async (campaign, portfolio) => {
    let oldPortfolio = await campaign.getPortfolio();
    PortfolioRepository.delete(oldPortfolio);
    campaign.setPortfolio(portfolio);
};

pub.update = async (campaign, title, releaseTime, description) => {
    if (title) campaign.title = title;
    if (releaseTime) campaign.releaseTime = releaseTime;
    if (description) campaign.description = description;
    await campaign.save();
};

pub.deleteOne = async (filter) => {
    let campaign = await pub.findOne(filter);
    await pub.delete(campaign);
};

pub.delete = async (campaign) => {
    if (campaign) {
        let portfolio = await campaign.getPortfolio();
        await PortfolioRepository.delete(portfolio);
        await campaign.destroy();
    }
};

module.exports = pub;
