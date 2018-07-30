const CampaignRepository = require('../orm/repository/campaignRepository');
const PortfolioService = require('./portfolioService');

let pub = {};

pub.findOne = async (filter) => {
    return await CampaignRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await CampaignRepository.findAllFilter(filter);
};

pub.getPortfolio = async (campaign) => {
    return await campaign.getPortfolio();
};

pub.create = async (key, localFile, title, releaseTime, description) => {
    try {
        let campaign = await CampaignRepository.create(title, releaseTime, description);
        let portfolioId = await PortfolioService.create(key, localFile);
        campaign.portfolioId = portfolioId['id'];
        await campaign.save();
        let id = campaign.get('id');
        return {id:id};
    } catch (e) {
        return e;
    }
};

pub.update = async (campaign, title, releaseTime, description) => {
    try {
        await CampaignRepository.update(campaign, title, releaseTime, description);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await CampaignRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createCampaignViewModel = async (campaign) => {
    try {
        let ret = {};
        ret['id'] = campaign.get('id');
        ret['title'] = campaign.get('title');
        ret['releaseTime'] = campaign.get('releaseTime');
        ret['description'] = campaign.get('description');
        let portfolio = await campaign.getPortfolio();
        if (portfolio) {
            ret['portfolio'] = await PortfolioService.createPortfolioViewModel(portfolio);
        }
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
