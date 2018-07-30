const ProductRepository = require('../orm/repository/productRepository');
const ProductImgRepository = require('../orm/repository/productImgRepository');
const ProductViewModel = require('../view_model/product');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.findOne = async (filter) => {
    return await ProductRepository.findOne(filter);
};

pub.create = async (key, localFile, title, session, releaseTime, introduction) => {
    try {
        let product = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            product = await ProductRepository.create(title, session, releaseTime, introduction, img);
        });
        let id = product.get('id');
        return {id: id};
    } catch (e) {
        return e;
    }
};

pub.updateImg = async (product, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await ProductRepository.updateImg(product, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.update = async (product, title, session, releaseTime, introduction) => {
    try {
        await ProductRepository.update(product, title, session, releaseTime, introduction);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.addProductImg = async (product, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await ProductRepository.addProductImg(product, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.addProductImgs = async (product, files) => {
    try {
        let timestamp = Date.parse(new Date());
        for(let x in files) {
            let localFile = files[x].path;
            await pub.addProductImg(product, timestamp + x, localFile);
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.findProductImg = async (product, imgId) => {
    try {
        return await ProductRepository.findProductImg(product, imgId);
    } catch (e) {
        return null;
    }
};

pub.deleteProductImg = async (productImg) => {
    try {
        await ProductRepository.deleteProductImg(productImg);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteProductImgs = async (product, productIds) => {
    try {
        for(let x in productIds) {
            let productImg = await pub.findProductImg(product, productIds[x]);
            if (productImg) {
                await ProductRepository.deleteProductImg(productImg[0]);
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await ProductRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createProductViewModel = async (product) => {
    try {
        let id = product.get('id');
        let title = product.get('title');
        let session = product.get('session');
        let releaseTime = product.get('releaseTime');
        let introduction = product.get('introduction');
        let img = await product.getCoverImg();
        let img_id = img.get('id');
        let img_url = img.get('url');
        let imgs = [];
        let productImgs = await product.getProductImgs();
        for(let x in productImgs) {
            let productImg = productImgs[x];
            let img1 = await productImg.getCoverImg();
            imgs.push({ img_id: img1.get('id'), img_url: img1.get('url') })
        }
        return ProductViewModel.createProduct(id, title, session, releaseTime, introduction, img_id, img_url, imgs);
    } catch (e) {
        console.log('123');
        return e;
    }
};

module.exports = pub;
