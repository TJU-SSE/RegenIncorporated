let pub = {};

pub.createIndexImgsViewModel = function (id, news_id, img_id, img_url, rank, news_title) {
    return {
        id: id,
        news_id: news_id,
        news_title: news_title,
        // img_id: img_id,
        img_url: img_url,
        rank: rank
    }
};

module.exports = pub;
