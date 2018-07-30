const LookbookRepository = require('../orm/repository/lookbookRepository');
const PortfolioService = require('./portfolioService');

let pub = {};

pub.findOne = async (filter) => {
    return await LookbookRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await LookbookRepository.findAllFilter(filter);
};

pub.getPortfolio = async (lookbook) => {
    return await lookbook.getPortfolio();
};

pub.create = async (key, localFile, title, releaseTime, description) => {
    try {
        let lookbook = await LookbookRepository.create(title, releaseTime, description);
        let portfolioId = await PortfolioService.create(key, localFile);
        lookbook.portfolioId = portfolioId['id'];
        await lookbook.save();
        let id = lookbook.get('id');
        return {id:id};
    } catch (e) {
        return e;
    }
};

pub.update = async (lookbook, title, releaseTime, description) => {
    try {
        await LookbookRepository.update(lookbook, title, releaseTime, description);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await LookbookRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createLookbookViewModel = async (lookbook) => {
    try {
        let ret = {};
        ret['id'] = lookbook.get('id');
        ret['title'] = lookbook.get('title');
        ret['releaseTime'] = lookbook.get('releaseTime');
        ret['description'] = lookbook.get('description');
        let portfolio = await lookbook.getPortfolio();
        if (portfolio) {
            ret['portfolio'] = await PortfolioService.createPortfolioViewModel(portfolio);
        }
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
