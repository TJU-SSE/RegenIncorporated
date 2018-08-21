let pub = {};

pub.createProduct = function (id, title, session, releaseTime, introduction, img_id, img_url, imgs, tags = [], rank = -1, index = null, banner = false, banner_rank = 0) {
    console.log(id, title, session, releaseTime, introduction, img_id, img_url, imgs, index);
    return {
        id: id,
        title: title,
        session: session,
        releaseTime: releaseTime,
        introduction: introduction,
        img_id: img_id,
        img_url: img_url,
        imgs: imgs,
        rank: rank,
        tags: tags,
        banner: banner,
        banner_rank: banner_rank,
        index
    };
};

module.exports = pub;
