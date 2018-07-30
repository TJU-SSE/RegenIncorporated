const ProductImg = require('../model/productImg');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.findAll = async () => {
    let res = await ProductImg.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await ProductImg.findOne({where: filter});
    return res;
};

pub.create = async (img) =>{
    let productImg = await ProductImg.create({});
    productImg.setCoverImg(img);
    return productImg;
};

pub.updateImg = async (productImg, img) => {
    let oldImg = await productImg.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    productImg.setCoverImg(img);
};

pub.deleteOne = async (filter) => {
    let productImg = await pub.findOne(filter);
    if (productImg) {
        let img = await productImg.getCoverImg();
        await Qiniu.deleteFile(img);
        await productImg.destroy();
    }
};

pub.delete = async (productImg) => {
    let img = await productImg.getCoverImg();
    await Qiniu.deleteFile(img);
    await productImg.destroy();
};

module.exports = pub;
