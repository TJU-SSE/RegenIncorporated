let pub = {};

pub.createNews = function (id, title, title_cn, writer, writer_cn ,content, content_cn, time, viewcount, img_id, img_url, tags) {
    return {
        id: id,
        title: title,
        writer: writer,
        content: content,
        title_cn: title_cn,
        writer_cn: writer_cn,
        content_cn: content_cn,
        time: time,
        viewcount: viewcount,
        img_id: img_id,
        img_url: img_url,
        tag: tags
    };
};

pub.createNewses = function (id, title, title_cn, writer, writer_cn, time, img_id, img_url, tags) {
    return {
        newsId: id,
        title: title,
        writer: writer,
        title_cn: title_cn,
        writer_cn: writer_cn,
        time: time,
        cover_img: img_url,
        tag: tags
    }
};

module.exports = pub;
