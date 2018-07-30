const Tag = require('../model/tag');

let pub = {};

pub.findAll = async () => {
    let res = await Tag.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await Tag.findOne({where: filter});
    return res;
};

pub.create = async (title) =>{
    return await Tag.create({
        title: title
    });
};

pub.update = async (tag, title) => {
    if (title) tag.title = title;
    await tag.save();
};

pub.findOrCreate = async (title) => {
    let tag = await pub.findOne({title:title});
    if (tag == null) {
        tag = await pub.create(title);
    }
    return tag;
};

pub.deleteOne = async (tag) => {
    let newsTags = await tag.getNewsTags();
    for (let x in newsTags) {
        let newsTag = newsTags[x];
        await newsTag.destroy();
    }
    let productTags = await tag.getProductTags();
    for (let x in productTags) {
        let productTag = productTags[x];
        await productTag.destroy();
    }
    await tag.destroy();
};

module.exports = pub;
