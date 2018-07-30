let pub = {};

pub.createProduct = function (id, title, session, releaseTime, introduction, img_id, img_url, imgs) {
    console.log(id, title, session, releaseTime, introduction, img_id, img_url, imgs);
    return {
        id: id,
        title: title,
        session: session,
        releaseTime: releaseTime,
        introduction: introduction,
        img_id: img_id,
        img_url: img_url,
        imgs: imgs
    };
};

module.exports = pub;
