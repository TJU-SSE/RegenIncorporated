const CooperationRepository = require('../orm/repository/cooperationRepository');
const PortfolioService = require('./portfolioService');

let pub = {};

pub.findOne = async (filter) => {
    return await CooperationRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await CooperationRepository.findAllFilter(filter);
};

pub.getPortfolio = async (cooperation) => {
    return await cooperation.getPortfolio();
};

pub.create = async (key, localFile, title, releaseTime, description) => {
    try {
        let cooperation = await CooperationRepository.create(title, releaseTime, description);
        let portfolioId = await PortfolioService.create(key, localFile);
        cooperation.portfolioId = portfolioId['id'];
        await cooperation.save();
        let id = cooperation.get('id');
        return {id:id};
    } catch (e) {
        return e;
    }
};

pub.update = async (cooperation, title, releaseTime, description) => {
    try {
        await CooperationRepository.update(cooperation, title, releaseTime, description);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await CooperationRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createCooperationViewModel = async (cooperation) => {
    try {
        let ret = {};
        ret['id'] = cooperation.get('id');
        ret['title'] = cooperation.get('title');
        ret['releaseTime'] = cooperation.get('releaseTime');
        ret['description'] = cooperation.get('description');
        let portfolio = await cooperation.getPortfolio();
        if (portfolio) {
            ret['portfolio'] = await PortfolioService.createPortfolioViewModel(portfolio);
        }
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
