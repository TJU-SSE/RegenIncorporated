let pub = {};

pub.createDesigner = function (id, name, identity, social, address, extraBiography, biography, rank, viewcount, first, img_id, img_url, title_img_id, title_img_url) {
    console.log(id, name, identity, social, address, extraBiography, biography, rank, img_id, img_url);
    return {
        id: id,
        name: name,
        identity: identity,
        social: social,
        address: address,
        extraBiography: extraBiography,
        biography: biography,
        rank: rank,
        viewcount: viewcount,
        first: first,
        img_id: img_id,
        img_url: img_url,
        title_img_id: title_img_id,
        title_img_url: title_img_url
    };
};

pub.createDesignerBrief = function (id, name, identity, rank, first, img_id, img_url, title_img_id, title_img_url) {
    console.log(id, name, identity, img_id, img_url);
    return {
        id: id,
        name: name,
        identity: identity,
        rank: rank,
        first: first,
        img_id: img_id,
        img_url: img_url,
        title_img_id: title_img_id,
        title_img_url: title_img_url
    };
};

module.exports = pub;
