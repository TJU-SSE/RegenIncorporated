const ShowLink = require('../model/showLink');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.findAll = async () => {
    let res = await ShowLink.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await ShowLink.findOne({where: filter});
    return res;
};

pub.create = async (img) =>{
    let showLink = await ShowLink.create({});
    showLink.setCoverImg(img);
    return showLink;
};

pub.updateImg = async (showLink, img) => {
    let oldImg = await showLink.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    showLink.setCoverImg(img);
};

pub.update = async (showLink) => {
    await showLink.save();
};

pub.updateRank = async (showLink, rank) => {
    showLink.rank = rank;
    await showLink.save();
};

pub.deleteOne = async (filter) => {
    let showLink = await pub.findOne(filter);
    await pub.delete(showLink);
};

pub.delete = async (showLink) => {
    if (showLink) {
        let img = await showLink.getCoverImg();
        await Qiniu.deleteFile(img);
        await showLink.destroy();
    }
};


module.exports = pub;
