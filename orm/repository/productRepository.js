const Product = require('../model/product');
const ProductImgRepository = require('./productImgRepository');
const ArtistProductRepository = require('./artistProductRepository');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.findAll = async () => {
    let res = await Product.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await Product.findOne({where: filter});
    return res;
};

pub.findProductImg = async (product, imgId) => {
    return product.getProductImgs({
        'where': {
            cover_img: imgId
        }
    });
};

pub.create = async (title, session, releaseTime, introduction, img) =>{
    let product = await Product.create({ title: title, session: session, releaseTime: releaseTime, introduction: introduction});
    product.setCoverImg(img);
    return product;
};

pub.updateImg = async (product, img) => {
    let oldImg = await product.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    product.setCoverImg(img);
};

pub.addProductImg = async (product, img) =>{
    let imgs = await product.getProductImgs();
    let productImg = await ProductImgRepository.create(img);
    imgs.push(productImg);
    product.setProductImgs(imgs);
};

pub.deleteProductImg = async (productImg) =>{
    console.log(productImg);
    await ProductImgRepository.delete(productImg);
};

pub.update = async (product, title, session, releaseTime, introduction) => {
    if (title) product.title = title;
    if (session) product.session = session;
    if (releaseTime) product.releaseTime = releaseTime;
    if (introduction) product.introduction = introduction;
    await product.save();
};

pub.deleteOne = async (filter) => {
    let product = await pub.findOne(filter);
    if (product) {
        let img = await product.getCoverImg();
        await Qiniu.deleteFile(img);
        let imgs = await product.getProductImgs();
        for (let x in imgs) {
            let img1 = imgs[x];
            await ProductImgRepository.delete(img1);
        }
        let articleProducts = await product.getArtistProducts();
        for (let x in articleProducts) {
            let articleProduct = articleProducts[x];
            await ArtistProductRepository.delete(articleProduct);
        }
        await product.destroy();
    }
};

module.exports = pub;
