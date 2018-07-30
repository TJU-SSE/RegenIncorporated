const IndexImgRepository = require('../orm/repository/indexImgRepository');
const IndexImgViewModel = require('../view_model/indexImg');

let pub = {};

pub.findOne = async (filter) => {
    return await IndexImgRepository.findOne(filter);
};

pub.findAll = async () => {
    return await IndexImgRepository.findAll();
};

pub.create = async (news, rank) => {
    try {
        let indexImg = await IndexImgRepository.create(news, rank);
        let id = indexImg.get('id');
        return {id: id};
    } catch (e) {
        return e;
    }
};

pub.update = async (indexImg, rank) => {
    try {
        await IndexImgRepository.update(indexImg, rank);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.updateRanks = async (ranks) => {
    try {
        let indexImgs = await pub.findAll();
        for (let x in ranks) {
            let id = ranks[x].id;
            let rank = ranks[x].rank;
            for (let y in indexImgs) {
                let indexImg = indexImgs[y];
                if (indexImg.get('id') == id) {
                    await IndexImgRepository.update(indexImg, rank);
                }
            }
        }
    } catch (e) {
        return e;
    }
};

pub.deleteIndexImgs = async (indexImgIds) => {
    try {
        for(let x in indexImgIds) {
            await IndexImgRepository.deleteOne({id: indexImgIds[x]});
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (indexImg) => {
    try {
        await IndexImgRepository.delete(indexImg);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createIndexImgViewModel = async (indexImg) => {

};

pub.createIndexImgsViewModel = async (indexImgs) => {
    try {
        let ret = [];
        for (let x in indexImgs) {
            let indexImg = indexImgs[x];
            let id = indexImg.get('id');
            let news = await indexImg.getNews();
            let news_id = news.get('id');
            let img = await news.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            let rank = indexImg.get('rank');
            ret.push(IndexImgViewModel.createIndexImgsViewModel(id, news_id, img_id, img_url, rank));
        }
        return ret.sort((a, b) => {
            return a.rank - b.rank;
        });
    } catch (e) {
        return e;
    }
};

module.exports = pub;
