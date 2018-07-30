const Season = require('../model/season');

let pub = {};

pub.findAll = async () => {
    let res = await Season.findAll({
        'order': 'year DESC, season DESC'
    });
    return res;
};

pub.findOrCreate = async (year, season_num) => {
    let season = await pub.findOne({year:year, season:season_num});
    if (season == null) {
        season = await pub.create(year, season_num);
    }
    return season;
};

pub.findOne = async (filter) => {
    let res = await Season.findOne({where: filter});
    return res;
};

pub.create = async (year, season_num) =>{
    let season = await Season.create({year:year, season:season_num});
    return season;
};

pub.deleteOne = async (filter) => {
    let season = await pub.findOne(filter);
    if (season) {
        await season.destroy();
    }
};

module.exports = pub;
