let pub = {};

pub.createNews = function (id, title, writer, content, time, rank, viewcount, img_id, img_url, tags) {
    return {
        id: id,
        title: title,
        writer: writer,
        content: content,
        time: time,
        viewcount: viewcount,
        rank: rank,
        img_id: img_id,
        img_url: img_url,
        tag: tags
    };
};

pub.createNewses = function (id, title, writer, time, img_id, img_url, tags) {
    return {
        newsId: id,
        title: title,
        writer: writer,
        time: time,
        cover_img: img_url,
        tag: tags
    }
};

pub.createIndexNews1 = function (id, title, writer, content, time, rank, img_id, img_url) {
    return {
        newsId: id,
        title: title,
        writer: writer,
        content: content,
        time: time,
        rank: rank,
        img_id: img_id,
        img_url: img_url
    }
};

pub.createIndexNews2 = function (id, title, rank, img_id, img_url) {
    return {
        newsId: id,
        title: title,
        rank: rank,
        img_id: img_id,
        img_url: img_url
    }
};

module.exports = pub;
