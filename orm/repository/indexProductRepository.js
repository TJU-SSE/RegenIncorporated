const IndexProduct = require('../model/indexProduct');

let pub = {};

pub.findAll = async () => {
    let res = await IndexProduct.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await IndexProduct.findAll({
      ...filter,
      order: [
        ['rank']
      ]
    });
    return res;
};

pub.findOne = async (filter) => {
    let res = await IndexProduct.findOne({where: filter});
    return res;
};

pub.getTotalSize = async () => {
    return await IndexProduct.count()
};

pub.create = async (news, rank) =>{
    let indexImg = await IndexProduct.create({rank: rank});
    indexImg.setProduct(news);
    return indexImg;
};

pub.update = async (indexProduct, rank) => {
    if (rank) indexProduct.rank = rank;
    indexProduct.save();
};

pub.deleteOne = async (filter) => {
    let indexProduct = await pub.findOne(filter);
    if (indexProduct) {
        await indexProduct.destroy();
    }
};

pub.delete = async (indexProduct) => {
    await indexProduct.destroy();
};

module.exports = pub;
