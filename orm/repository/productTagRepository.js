const ProductTag = require('../model/productTag');

let pub = {};

pub.findAll = async () => {
    let res = await ProductTag.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await ProductTag.findAll({where: filter});
    return res;
};

pub.findOne = async (filter) => {
    let res = await ProductTag.findOne({where: filter});
    return res;
};

pub.create = async (product, tag) =>{
    let productId = product.get('id');
    let tagId = tag.get('id');
    let productTag = await ProductTag.create({productId: productId, tagId: tagId});
    return productTag;
};

pub.deleteOne = async (filter) => {
    let productTag = await pub.findOne(filter);
    if (productTag) {
        await pub.delete(productTag);
    }
};

pub.delete = async (productTag) => {
    await productTag.destroy();
};

pub.getProductTagsByProduct = async (product) => {
    return product.getProductTags();
};

pub.getProductTagsByTag = async (tag) => {
    return tag.getProductTags();
};

module.exports = pub;
