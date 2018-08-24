const PhotographyTag = require('../model/photographyTag');

let pub = {};

pub.findAll = async () => {
    let res = await PhotographyTag.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await PhotographyTag.findAll({where: filter});
    return res;
};

pub.findOne = async (filter) => {
    let res = await PhotographyTag.findOne({where: filter});
    return res;
};

pub.create = async (photography, tag) =>{
    let photographyId = photography.get('id');
    let tagId = tag.get('id');
    let photographyTag = await PhotographyTag.create({ photographyId: photographyId, tagId: tagId});
    return photographyTag;
};

pub.deleteOne = async (filter) => {
    let photographyTag = await pub.findOne(filter);
    if (photographyTag) {
        await pub.delete(photographyTag);
    }
};

pub.delete = async (photographyTag) => {
    await photographyTag.destroy();
};

pub.getPhotographyTagsByPhotography = async (photography) => {
    return photography.getPhotographyTags();
};

pub.getPhotographyTagsByTag = async (tag) => {
    return tag.getPhotographyTags();
};

module.exports = pub;
