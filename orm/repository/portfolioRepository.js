const Portfolio = require('../model/portfolio');
const PortfolioImgRepository = require('../repository/portfolioImgRepository');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.findAll = async () => {
    let res = await Portfolio.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Portfolio.findAll({where: filter});
    return res;
};

pub.findOne = async (filter) => {
    let res = await Portfolio.findOne({where: filter});
    return res;
};

pub.findPortfolioImg = async (portfolio, imgId) => {
    return await portfolio.getPortfolioImgs({
        'where': {
            cover_img: imgId
        }
    });
};

pub.create = async (img) =>{
    let portfolio = await Portfolio.create({});
    portfolio.setCoverImg(img);
    return portfolio;
};

pub.updateImg = async (portfolio, img) => {
    let oldImg = await portfolio.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    portfolio.setCoverImg(img);
};

pub.update = async (portfolio) => {
    // if(name) artist.name = name;
    await portfolio.save();
};

pub.addPortfolioImg = async (portfolio, rank, img) => {
    let portfolioImg = await PortfolioImgRepository.create(rank, img);
    portfolioImg.portfolioId = portfolio.get('id');
    portfolioImg.save();
};

pub.deletePortfolioImg = async (portfolioImg) =>{
    console.log(portfolioImg);
    await PortfolioImgRepository.delete(portfolioImg);
};

pub.deleteOne = async (filter) => {
    let portfolio = await pub.findOne(filter);
    pub.delete(portfolio);
};

pub.delete = async (portfolio) => {
    if (portfolio) {
        let img = await portfolio.getCoverImg();
        await Qiniu.deleteFile(img);
        let portfolioImgs = await PortfolioImgRepository.getPortfolioImgs(portfolio);
        for (let x in portfolioImgs) {
            let portfolioImg = portfolioImgs[x];
            await PortfolioImgRepository.delete(portfolioImg);
        }
        await portfolio.destroy();
    }
};

module.exports = pub;
