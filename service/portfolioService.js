const PortfolioRepository = require('../orm/repository/portfolioRepository');
const PortfolioImgRepository = require('../orm/repository/portfolioImgRepository');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.findOne = async (filter) => {
    return await PortfolioRepository.findOne(filter);
};

pub.create = async (key, localFile) => {
    try {
        let portfolio = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            portfolio = await PortfolioRepository.create(img);
        });
        let id = portfolio.get('id');
        return {id: id};
    } catch (e) {
        return e;
    }
};

pub.updateImg = async (portfolio, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await PortfolioRepository.updateImg(portfolio, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.update = async (portfolio) => {
    try {
        await PortfolioRepository.update(portfolio);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.addPortfolioImg = async (portfolio, rank, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await PortfolioRepository.addPortfolioImg(portfolio, rank, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.addPortfolioImgs = async (portfolio, rank, files) => {
    try {
        let timestamp = Date.parse(new Date());
        for(let x in files) {
            let localFile = files[x].path;
            await pub.addPortfolioImg(portfolio, rank, timestamp + x, localFile);
            rank++;
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.findPortfolioImg = async (portfolio, imgId) => {
    try {
        return await PortfolioRepository.findPortfolioImg(portfolio, imgId);
    } catch (e) {
        return null;
    }
};

pub.deletePortfolioImg = async (portfolioImg) => {
    try {
        await PortfolioRepository.deletePortfolioImg(portfolioImg);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deletePortfolioImgs = async (portfolio, ids) => {
    try {
        for(let x in ids) {
            let portfolioImg = await pub.findPortfolioImg(portfolio, ids[x]);
            if (portfolioImg) {
                await PortfolioRepository.deletePortfolioImg(portfolioImg[0]);
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.updateRanks = async (portfolio, imgRanks) => {
    try {
        let portfolioImgs = await PortfolioImgRepository.getPortfolioImgs(portfolio);
        for (let x in imgRanks) {
            let imgId = imgRanks[x].img_id;
            let rank = imgRanks[x].rank;
            for (let y in portfolioImgs) {
                let portfolioImg = portfolioImgs[y];
                if (portfolioImg.get('cover_img') == imgId) {
                    await PortfolioImgRepository.update(portfolioImg, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await PortfolioRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createPortfolioViewModel = async (portfolio) => {
    try {
        let ret = {};
        ret['id'] = portfolio.get('id');
        let img = await portfolio.getCoverImg();
        ret['img_id'] = img.get('id');
        ret['img_url'] = img.get('url');
        let imgs = [];
        let portfolioImgs = await portfolio.getPortfolioImgs();
        for(let x in portfolioImgs) {
            let portfolioImg = portfolioImgs[x];
            let img1 = await portfolioImg.getCoverImg();
            imgs.push({ rank: portfolioImg.get('rank'), img_id: img1.get('id'), img_url: img1.get('url') })
        }
        ret['imgs'] = imgs.sort((a, b) => { return a.rank - b.rank});
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
