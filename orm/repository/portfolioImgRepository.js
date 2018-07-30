const PortfolioImg = require('../model/portfolioImg');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.findAll = async () => {
    let res = await PortfolioImg.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await PortfolioImg.findOne({where: filter});
    return res;
};

pub.create = async (rank, img) =>{
    let portfolioImg = await PortfolioImg.create({rank: rank});
    portfolioImg.setCoverImg(img);
    return portfolioImg;
};

pub.updateImg = async (portfolioImg, img) => {
    let oldImg = await portfolioImg.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    portfolioImg.setCoverImg(img);
};

pub.update = async (portfolioImg, rank) => {
    portfolioImg.rank = rank;
    await portfolioImg.save();
};

pub.deleteOne = async (filter) => {
    let portfolioImg = await pub.findOne(filter);
    await pub.delete(portfolioImg);
};

pub.delete = async (portfolioImg) => {
    if (portfolioImg) {
        let img = await portfolioImg.getCoverImg();
        await Qiniu.deleteFile(img);
        await portfolioImg.destroy();
    }
};

pub.getPortfolioImgs = async (portfolio) => {
    return portfolio.getPortfolioImgs();
};

module.exports = pub;
