const ArtistProduct = require('../model/atristProduct');

let pub = {};

pub.findAll = async () => {
    let res = await ArtistProduct.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await ArtistProduct.findAll({where: filter});
    return res;
};

pub.findOne = async (filter) => {
    let res = await ArtistProduct.findOne({where: filter});
    return res;
};

pub.create = async (artist, product, rank) =>{
    let artistProducts1 = await artist.getArtistProducts();
    let artistProduct = await ArtistProduct.create({ rank: rank });
    artistProducts1.push(artistProduct);
    artist.setArtistProducts(artistProducts1);
    let artistProducts2 = await product.getArtistProducts();
    artistProducts2.push(artistProduct);
    product.setArtistProducts(artistProducts2);
    return artistProduct;
};

pub.update = async (artistProduct, rank) => {
    if (rank) artistProduct.rank = rank;
    await artistProduct.save();
};

pub.deleteOne = async (filter) => {
    let artistProduct = await pub.findOne(filter);
    if (artistProduct) {
        await artistProduct.destroy();
    }
};

pub.delete = async (artistProduct) => {
    await artistProduct.destroy();
};

pub.getArtistProducts = async (artist) => {
    return artist.getArtistProducts();
};

module.exports = pub;
