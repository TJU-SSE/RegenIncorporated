const NewsRepository = require('../orm/repository/newsRepository');
const TagRepository = require('../orm/repository/tagRepository');
const NewsViewModel = require('../view_model/news');
const NewsTagRepository = require('../orm/repository/newsTagRepository');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.findOne = async (filter) => {
    return await NewsRepository.findOne(filter);
};

pub.getTotalSize = async () => {
    return await NewsRepository.getTotalSize();
};

pub.findAll = async (filter) => {
    return await NewsRepository.findAll(filter);
};

pub.create = async (key, localFile, title, writer, content, time, tags) => {
    try {
        let news = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            news = await NewsRepository.create(title, writer, content, time, img, tags);
        });
        let id = news.get('id');
        return {id:id};
    } catch (e) {
        return e;
    }
};

pub.updateImg = async (news, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await NewsRepository.updateImg(news, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.update = async (news, title, writer, content, time, tags) => {
    try {
        await NewsRepository.update(news, title, writer, content, time, tags);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await NewsRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createNewsViewModel = async (news) => {
    try {
        let id = news.get('id');
        let title = news.get('title');
        let writer = news.get('writer');
        let content = news.get('content');
        let time = news.get('time');
        let rank = news.get('rank');
        let viewcount = news.get('viewcount');
        let img = await news.getCoverImg();
        let img_id = img.get('id');
        let img_url = img.get('url');
        let newsTags = await news.getNewsTags();
        let tags = [];
        for (let x in newsTags) {
            let newsTag = newsTags[x];
            let tagId = newsTag.get('tagId');
            let tag = await TagRepository.findOne({id: tagId});
            let tagTitle = tag.get('title');
            tags.push({tagId:tagId, tagTitle:tagTitle});
        }
        return NewsViewModel.createNews(id, title, writer, content, time, rank, viewcount, img_id, img_url, tags);
    } catch (e) {
        return e;
    }
};

pub.createNewsesViewModel = async (newses, pageOffset, itemSize, total) => {
    try {
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for (let x in newses) {
            let news = newses[x];
            let id = news.get('id');
            let title = news.get('title');
            let writer = news.get('writer');
            let time = news.get('time');
            let img = await news.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            let newsTags = await news.getNewsTags();
            let tags = [];
            for (let x in newsTags) {
                let newsTag = newsTags[x];
                let tagId = newsTag.get('tagId');
                let tag = await TagRepository.findOne({id: tagId});
                let tagTitle = tag.get('title');
                tags.push({tagId:tagId, tagTitle:tagTitle});
            }
            list.push(NewsViewModel.createNewses(id, title, writer, time, img_id, img_url, tags))
        }
        ret['newses'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.createNewsesViewModelWithoutPage = async (newses) => {
    try {
        let ret = {};
        let list = [];
        for (let x in newses) {
            let news = newses[x];
            let id = news.get('id');
            let title = news.get('title');
            let writer = news.get('writer');
            let time = news.get('time');
            let img = await news.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            let newsTags = await news.getNewsTags();
            let tags = [];
            for (let x in newsTags) {
                let newsTag = newsTags[x];
                let tagId = newsTag.get('tagId');
                let tag = await TagRepository.findOne({id: tagId});
                let tagTitle = tag.get('title');
                tags.push({tagId:tagId, tagTitle:tagTitle});
            }
            list.push(NewsViewModel.createNewses(id, title, writer, time, img_id, img_url, tags))
        }
        ret['newses'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.createIndexNewsesViewModel = async (newses) => {
    try {
        let ret = {'newsIndex': [], 'news': []};
        for (let x in newses) {
            let news = newses[x];
            let id = news.get('id');
            let title = news.get('title');
            let writer = news.get('writer');
            let content = news.get('content');
            let time = news.get('time');
            let rank = news.get('rank');
            let img = await news.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            if (rank < 4) {
                ret['newsIndex'].push(NewsViewModel.createIndexNews1(id, title, writer, content, time, rank, img_id, img_url));
            } else {
                ret['news'].push(NewsViewModel.createIndexNews2(id, title, rank, img_id, img_url));
            }
        }
        return ret;
    } catch (e) {
        return e;
    }
};

pub.getRecommand = async function (filter) {
    try {
        let findNewsTags = await NewsTagRepository.findAllFilter(filter);
        let newses = [];
        for (let i in findNewsTags) {
            let newsId = findNewsTags[i].get('newsId');
            let news1 = await NewsRepository.findOne({id:newsId});
            newses.push(news1);
        }
        newses.sort((a, b) => {
            return b.time - a.time;
        });
        let ret = [];
        for (let x in newses) {
            if (x < 4){
                let news = newses[x];
                let id = news.get('id');
                let title = news.get('title');
                let writer = news.get('writer');
                let time = news.get('time');
                let img = await news.getCoverImg();
                let img_id = img.get('id');
                let img_url = img.get('url');
                let newsTags = await news.getNewsTags();
                let tags = [];
                for (let y in newsTags) {
                    let newsTag = newsTags[y];
                    let tagId = newsTag.get('tagId');
                    let tag = await TagRepository.findOne({id: tagId});
                    let tagTitle = tag.get('title');
                    tags.push({tagId:tagId, tagTitle:tagTitle});
                }
                ret.push(NewsViewModel.createNewses(id, title, writer, time, img_id, img_url, tags));
            }
        }
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
