const TagRepository = require('../orm/repository/tagRepository');
const NewsTagRepository = require('../orm/repository/newsTagRepository');
const TagViewModel = require('../view_model/tag');

let pub = {};

pub.findOne = async (filter) => {
    return await TagRepository.findOne(filter);
};

pub.findNewsTag = async (filter) => {
    return await NewsTagRepository.findOne(filter);
};

pub.create = async (title) => {
    try {
        let tag = await TagRepository.findOrCreate(title);
        let id = tag.get('id');
        let tagTitle = tag.get('title');
        return {id: id, title: tagTitle};
    } catch (e) {
        return e;
    }
};

pub.findAll = async() => {
    try {
        let tags = await TagRepository.findAll();
        let ret = [];
        for (let x in tags) {
            let tag = tags[x];
            let id = tag.get('id');
            let title = tag.get('title');
            ret.push({id: id, title: title});
        }
        return ret;
    } catch (e) {
        return e;
    }
};

pub.update = async(tag, title) => {
    try {
        await TagRepository.update(tag, title);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (tag) => {
    try {
        await TagRepository.deleteOne(tag);
        return 'success';
    } catch (e) {
        return e;
    }
};

module.exports = pub;
