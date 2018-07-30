const ArtistRepository = require('../orm/repository/artistRepository');
const ArtistProductRepository = require('../orm/repository/artistProductRepository');
const AchievementRepository = require('../orm/repository/achievementRepository');
const ProductRepository = require('../orm/repository/productRepository');
const ArtistViewModel = require('../view_model/artist');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.getTotalSize = async (identity) => {
    return await ArtistRepository.getTotalSize(identity)
};

pub.findOne = async (filter) => {
    return await ArtistRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await ArtistRepository.findAllFilter(filter);
};

pub.findArtistProduct = async (filter) => {
    return await ArtistProductRepository.findOne(filter);
};

pub.findAchievement = async (filter) => {
    return await AchievementRepository.findOne(filter);
};

pub.create = async (key, localFile, name, identity, social, address, extraBiography, biography) => {
    try {
        let artist = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            artist = await ArtistRepository.create(name, identity, social, address, extraBiography, biography, img);
        });
        let id = artist.get('id');
        let img = await artist.getCoverImg();
        return {id:id, img_url: img.get('url')};
    } catch (e) {
        return e;
    }
};

pub.updateImg = async (artist, key, localFile) => {
    try {
        let newImg = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await ArtistRepository.updateImg(artist, img);
            newImg = img
        });
        return newImg.get('url');
    } catch (e) {
        return e;
    }
};

pub.update = async (artist, name, identity, social, address, extraBiography, biography) => {
    try {
        await ArtistRepository.update(artist, name, identity, social, address, extraBiography, biography);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await ArtistRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createArtistViewModel = async (artist) => {
    try {
        let id = artist.get('id');
        let name = artist.get('name');
        let identity = artist.get('identity');
        let social = artist.get('social');
        let address = artist.get('address');
        let extraBiography = artist.get('extraBiography');
        let biography = artist.get('biography');
        let viewcount = artist.get('viewcount');
        let img = await artist.getCoverImg();
        let img_id = img.get('id');
        let img_url = img.get('url');
        return ArtistViewModel.createArtist(id, name, identity, social, address, extraBiography, biography, viewcount, img_id, img_url);
    } catch (e) {
        console.log('123');
        return e;
    }
};

pub.createArtistsViewModel = async (artists, pageOffset, itemSize, total) => {
    try {
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in artists) {
            let artist = artists[x];
            let id = artist.get('id');
            let name = artist.get('name');
            let identity = artist.get('identity');
            let img = await artist.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            const biography = JSON.parse(artist.get('biography')) || {};
            list.push(ArtistViewModel.createArtistBrief(id, name, identity, img_id, img_url, biography.role))
        }
        ret['artists'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.createArtistProduct = async (artist, product, rank) => {
    try {
        let artistProduct = await ArtistProductRepository.create(artist, product, rank);
        return {id: artistProduct.get('id')};
    } catch (e) {
        return e;
    }
};

pub.createAchievement = async (artist, product, rank) => {
    try {
        let achievement = await AchievementRepository.create(artist, product, rank);
        return {id: achievement.get('id')};
    } catch (e) {
        return e;
    }
};

pub.createArtistProductsViewModel = async (artist, pageOffset, itemSize) => {
    try {
        let [artistProducts, total] = await ArtistProductRepository.getArtistProducts(artist, pageOffset, itemSize);
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in artistProducts) {
            let artistProduct = artistProducts[x];
            let artistProductId = artistProduct.get('id');
            let rank = artistProduct.get('rank');
            let productId = artistProduct.get('productId');
            let product = await ProductRepository.findOne({id:productId});
            let title = product.get('title');
            let session = product.get('session');
            let releaseTime = product.get('releaseTime');
            let introduction = product.get('introduction');
            let img = await product.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push(ArtistViewModel.createArtistProducts(
                artistProductId, rank, productId, title, session, releaseTime, introduction, img_id, img_url)
            );
        }
        ret['artistProducts'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.createAchievementsViewModel = async (artist, pageOffset, itemSize) => {
    try {
        let [achievements, total] = await AchievementRepository.getAchievements(artist, pageOffset, itemSize);
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in achievements) {
            let achievement = achievements[x];
            let achievementId = achievement.get('id');
            let rank = achievement.get('rank');
            let productId = achievement.get('productId');
            let product = await ProductRepository.findOne({id:productId});
            let title = product.get('title');
            let session = product.get('session');
            let releaseTime = product.get('releaseTime');
            let introduction = product.get('introduction');
            let img = await product.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push(ArtistViewModel.createAchievements(
                achievementId, rank, productId, title, session, releaseTime, introduction, img_id, img_url)
            );
        }
        ret['achievements'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateRanks = async (artist, products) => {
    try {
        let artistProducts = await artist.getArtistProducts();
        for (let x in products) {
            let productId = products[x].productId;
            let rank = products[x].rank;
            for (let y in artistProducts) {
                let artistProduct = artistProducts[y];
                if (artistProduct.get('productId') == productId) {
                    await ArtistProductRepository.update(artistProduct, rank);
                }
            }
        }
        return "success";
    } catch (e) {
        return e;
    }
};

pub.updateAchievementsRanks = async (artist, products) => {
    try {
        let achievements = await artist.getAchievements();
        for (let x in products) {
            let productId = products[x].productId;
            let rank = products[x].rank;
            for (let y in achievements) {
                let achievement = achievements[y];
                if (achievement.get('productId') == productId) {
                    await AchievementRepository.update(achievement, rank);
                }
            }
        }
        return "success";
    } catch (e) {
        return e;
    }
};

pub.deleteArtistProduct = async (artistProduct) => {
    try {
        await ArtistProductRepository.delete(artistProduct);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteAchievement = async (achievement) => {
    try {
        await AchievementRepository.delete(achievement);
        return 'success';
    } catch (e) {
        return e;
    }
};

module.exports = pub;
