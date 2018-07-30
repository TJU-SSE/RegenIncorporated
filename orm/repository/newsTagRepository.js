const NewsTag = require('../model/newsTag');

let pub = {};

pub.findAll = async () => {
    let res = await NewsTag.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await NewsTag.findAll({where: filter});
    return res;
};

pub.findOne = async (filter) => {
    let res = await NewsTag.findOne({where: filter});
    return res;
};

pub.create = async (news, tag) =>{
    let newsId = news.get('id');
    let tagId = tag.get('id');
    let newsTag = await NewsTag.create({newsId: newsId, tagId: tagId});
    return newsTag;
};

pub.deleteOne = async (filter) => {
    let newsTag = await pub.findOne(filter);
    if (newsTag) {
        await pub.delete(newsTag);
    }
};

pub.delete = async (newsTag) => {
    await newsTag.destroy();
};

pub.getNewsTagByNews = async (news) => {
    return news.getNewsTags();
};

pub.getNewsTagByTag = async (tag) => {
    return tag.getNewsTags();
};

module.exports = pub;
