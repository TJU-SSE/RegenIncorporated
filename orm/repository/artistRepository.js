const Artist = require('../model/artist');
const ArtistProductRepository = require('./artistProductRepository');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.findAll = async () => {
    let res = await Artist.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Artist.findAll({where: filter});
    return res;
};

pub.findOne = async (filter) => {
    let res = await Artist.findOne({where: filter});
    if (res) {
        res.viewcount += 1;
        res.save();
    }
    return res;
};

pub.create = async (name, identity, social, address, extraBiography, biography, img) =>{
    let artist = await Artist.create({ name: name, identity: identity, social: social, address: address, extraBiography: extraBiography, biography: biography, viewcount: 0 });
    artist.setCoverImg(img);
    return artist;
};

pub.updateImg = async (artist, img) => {
    let oldImg = await artist.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    artist.setCoverImg(img);
};

pub.update = async (artist, name, identity, social, address, extraBiography, biography) => {
    if(name) artist.name = name;
    if(identity) artist.identity = identity;
    if(social) artist.social = social;
    if(address) artist.address = address;
    if(extraBiography) artist.extraBiography = extraBiography;
    if(biography) artist.biography = biography;
    await artist.save();
};

pub.deleteOne = async (filter) => {
    let artist = await pub.findOne(filter);
    if (artist) {
        let img = await artist.getCoverImg();
        await Qiniu.deleteFile(img);
        let articleProducts = await ArtistProductRepository.getArtistProducts(artist);
        for (let x in articleProducts) {
            let articleProduct = articleProducts[x];
            await ArtistProductRepository.delete(articleProduct);
        }
        await artist.destroy();
    }
};

module.exports = pub;
