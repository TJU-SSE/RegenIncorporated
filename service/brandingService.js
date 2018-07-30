const BrandingRepository = require('../orm/repository/brandingRepository');
const PortfolioService = require('./portfolioService');

let pub = {};

pub.findOne = async (filter) => {
    return await BrandingRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await BrandingRepository.findAllFilter(filter);
};

pub.getPortfolio = async (branding) => {
    return await branding.getPortfolio();
};

pub.create = async (key, localFile, title, releaseTime, description) => {
    try {
        let branding = await BrandingRepository.create(title, releaseTime, description);
        let portfolioId = await PortfolioService.create(key, localFile);
        branding.portfolioId = portfolioId['id'];
        await branding.save();
        let id = branding.get('id');
        return {id:id};
    } catch (e) {
        return e;
    }
};

pub.update = async (branding, title, releaseTime, description) => {
    try {
        await BrandingRepository.update(branding, title, releaseTime, description);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await BrandingRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createBrandingViewModel = async (branding) => {
    try {
        let ret = {};
        ret['id'] = branding.get('id');
        ret['title'] = branding.get('title');
        ret['releaseTime'] = branding.get('releaseTime');
        ret['description'] = branding.get('description');
        let portfolio = await branding.getPortfolio();
        if (portfolio) {
            ret['portfolio'] = await PortfolioService.createPortfolioViewModel(portfolio);
        }
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
