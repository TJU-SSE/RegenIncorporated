const News = require('../model/news');
const NewsTagRepository = require('./newsTagRepository');
const TagRepository = require('./tagRepository');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.getTotalSize = async () => {
    return await News.count()
};

pub.findAll = async (filter) => {
    filter['order'] = 'time DESC';
    let res = await News.findAll(filter);
    return res;
};

pub.findOne = async (filter) => {
    let res = await News.findOne({where: filter});
    if (res) {
        res.viewcount += 1;
        res.save();
    }
    return res;
};

pub.create = async (title, writer, content, time, img, tags) =>{
    let news = await News.create({ title: title, writer: writer, content: content, time: time, viewcount: 0});
    news.setCoverImg(img);
    let newsTags = [];
    for (let x in tags) {
        let tagTitle = tags[x];
        let tag = await TagRepository.findOrCreate(tagTitle);
        let newsTag = await NewsTagRepository.create(news, tag);
        newsTags.push(newsTag);
    }
    await news.setNewsTags(newsTags);
    return news;
};

pub.updateImg = async (news, img) => {
    let oldImg = await news.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    news.setCoverImg(img);
};

pub.update = async (news, title, writer, content, time, tags) => {
    if(title) news.title = title;
    if(writer) news.writer = writer;
    if(content) news.content = content;
    if(time) news.time = time;
    if(tags) {
        let oldTags = await news.getNewsTags();
        for (let x in oldTags) {
            let newsTag = oldTags[x];
            await NewsTagRepository.delete(newsTag);
        }

        let tag = await TagRepository.findOrCreate(tags);
        let newsTag = await NewsTagRepository.create(news, tag);
        newsTags.push(newsTag);
        await news.setNewsTags(newsTags);
    }
    await news.save();
};

pub.deleteOne = async (filter) => {
    let news = await pub.findOne(filter);
    if (news) {
        let img = await news.getCoverImg();
        await Qiniu.deleteFile(img);
        let newsTags = await news.getNewsTags();
        for (let x in newsTags) {
            let newsTag = newsTags[x];
            await newsTag.destroy();
        }
        await news.destroy();
    }
};

module.exports = pub;
