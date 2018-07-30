const Product = require('../model/product');
const ProductImgRepository = require('./productImgRepository');
const ArtistProductRepository = require('./artistProductRepository');
const AchievementRepository = require('./achievementRepository');
const ProductTagRepository = require('./productTagRepository');
const IndexProductRepository = require('./indexProductRepository');
const Qiniu = require('../../utils/qiniu');
var TagRepository = require("./tagRepository.js");

let pub = {};

pub.findAll = async () => {
    let res = await Product.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    filter['order'] = 'releaseTime DESC';
    let res = await Product.findAll(filter);
    return res;
};

pub.search = async (key, filter) => {
    filter['where'] = {
        title: {
            $like: '%' + key + '%'
        }
    };
    filter['order'] = 'releaseTime DESC';
    let res = await Product.findAndCountAll(filter);
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

pub.count = async () => {
    return await Product.count();
};

pub.create = async (title, session, releaseTime, introduction, img, tags) =>{
    let product = await Product.create({ title: title, session: session, releaseTime: releaseTime, introduction: introduction});
    product.setCoverImg(img);
    let productTags = [];
    for (let x in tags) {
        let tagTitle = tags[x];
        let tag = await TagRepository.findOrCreate(tagTitle);
        let productTag = await ProductTagRepository.create(product, tag);
        productTags.push(productTag);
    }
    await product.setProductTags(productTags);
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

pub.update = async (product, title, session, releaseTime, introduction, tags) => {
    if (title) product.title = title;
    if (session) product.session = session;
    if (releaseTime) product.releaseTime = releaseTime;
    if (introduction) product.introduction = introduction;
    if(tags) {
        let oldTags = await product.getProductTags();
        for (let x in oldTags) {
            let productTag = oldTags[x];
            await ProductTagRepository.delete(productTag);
        }
        let productTags = [];
        for (let x in tags) {
            let tagTitle = tags[x];
            let tag = await TagRepository.findOrCreate(tagTitle);
            let productTag = await ProductTagRepository.create(product, tag);
            productTags.push(productTag);
        }
        await product.setProductTags(productTags);
    }
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
        let achievements = await product.getAchievements();
        for (let x in achievements) {
            let achievement = achievements[x];
            await AchievementRepository.delete(achievement);
        }
        let productTags = await product.getProductTags();
        for (let x in productTags) {
            let productTag = productTags[x];
            await productTag.destroy();
        }
        await IndexProductRepository.deleteOne({product_id:product.get('id')});
        await product.destroy();
    }
};

module.exports = pub;
