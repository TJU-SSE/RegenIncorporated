const IndexImg = require('../model/indexImg');

let pub = {};

pub.findAll = async () => {
    let res = await IndexImg.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await IndexImg.findAll({where: filter});
    return res;
};

pub.findOne = async (filter) => {
    let res = await IndexImg.findOne({where: filter});
    return res;
};

pub.create = async (news, rank) =>{
    let indexImg = await IndexImg.create({rank: rank});
    indexImg.setNews(news);
    return indexImg;
};

pub.update = async (indexImg, rank) => {
    if (rank) indexImg.rank = rank;
    indexImg.save();
};

pub.deleteOne = async (filter) => {
    let indexImg = await pub.findOne(filter);
    if (indexImg) {
        await indexImg.destroy();
    }
};

pub.delete = async (indexImg) => {
    await indexImg.destroy();
};

module.exports = pub;
