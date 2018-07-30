let pub = {};

pub.createArtist = function (id, name, identity, social, address, extraBiography, biography, viewcount, img_id, img_url) {
    console.log(id, name, identity, social, address, extraBiography, biography, img_id, img_url);
    return {
        id: id,
        name: name,
        identity: identity,
        social: social,
        address: address,
        extraBiography: extraBiography,
        biography: biography,
        viewcount: viewcount,
        img_id: img_id,
        img_url: img_url
    };
};

pub.createArtistBrief = function (id, name, identity, img_id, img_url) {
    console.log(id, name, identity, img_id, img_url);
    return {
        id: id,
        name: name,
        identity: identity,
        img_id: img_id,
        img_url: img_url
    };
};

pub.createArtistProducts = function (artistProductId, rank, productId, title, session, releaseTime, introduction, img_id, img_url) {
   return {
       artistProductId: artistProductId,
       rank: rank,
       productId: productId,
       title: title,
       session: session,
       releaseTime: releaseTime,
       introduction:introduction,
       img_id: img_id,
       img_url: img_url
    }
};

module.exports = pub;
