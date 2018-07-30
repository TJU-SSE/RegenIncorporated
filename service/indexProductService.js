const IndexProductRepository = require('../orm/repository/indexProductRepository');
const ProductTagRepository = require('../orm/repository/productTagRepository');
const TagRepository = require('../orm/repository/tagRepository');
const IndexProductViewModel = require('../view_model/indexProduct');

let pub = {};

pub.findOne = async (filter) => {
    return await IndexProductRepository.findOne(filter);
};

pub.findAll = async (filter) => {
    return await IndexProductRepository.findAllFilter(filter);
};

pub.getTotalSize = async () => {
    return await IndexProductRepository.getTotalSize();
};

pub.create = async (news, rank) => {
    try {
        let indexProduct = await IndexProductRepository.create(news, rank);
        let id = indexProduct.get('id');
        return {id: id};
    } catch (e) {
        return e;
    }
};

pub.update = async (indexProduct, rank) => {
    try {
        await IndexProductRepository.update(indexProduct, rank);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.updateRanks = async (ranks) => {
    try {
        let indexProducts = await pub.findAll();
        for (let x in ranks) {
            let id = ranks[x].id;
            let rank = ranks[x].rank;
            console.log(id + ' ' + rank);
            for (let y in indexProducts) {
                let indexProduct = indexProducts[y];
                if (indexProduct.get('id') == id) {
                    await IndexProductRepository.update(indexProduct, rank);
                }
            }
        }
    } catch (e) {
        return e;
    }
};

pub.getIndexProductsByTags = async (tags, pageOffset, itemSize) => {
    try {
        let indexProducts = await pub.findAll();
        let tagIndexProducts = [];
        for (let x in indexProducts) {
            let indexProduct = indexProducts[x];
            let id = indexProduct.get('id');
            let product = await indexProduct.getProduct();
            let productTags = await product.getProductTags();
            let find = false;
            for (let x in productTags) {
                let productTag = productTags[x];
                let tagId = productTag.get('tagId');
                let tag = await TagRepository.findOne({id: tagId});
                let tagTitle = tag.get('title');
                for (let y in tags) {
                    if (tagTitle == tags[y]) {
                        tagIndexProducts.push(indexProduct);
                        find = true;
                        break;
                    }
                }
                if (find) break;
            }
        }
        let total = tagIndexProducts.length;
        tagIndexProducts = tagIndexProducts.slice(pageOffset, pageOffset + itemSize);
        return pub.createIndexProductsViewModel(tagIndexProducts, pageOffset, itemSize, total);
    } catch (e) {
        return e;
    }
};

pub.deleteIndexProducts = async (indexProductIds) => {
    try {
        for(let x in indexProductIds) {
            await IndexProductRepository.deleteOne({id: indexProductIds[x]});
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (indexProduct) => {
    try {
        await IndexProductRepository.delete(indexProduct);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createIndexProductViewModel = async (indexProduct) => {

};

pub.createIndexProductsViewModel = async (indexProducts, pageOffset, itemSize, total) => {
    try {
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for (let x in indexProducts) {
            let indexProduct = indexProducts[x];
            let id = indexProduct.get('id');
            let rank = indexProduct.get('rank');
            let product = await indexProduct.getProduct();
            let product_id = product.get('id');
            let title = product.get('title');
            let session = product.get('session');
            let releaseTime = product.get('releaseTime');
            let introduction = product.get('introduction');
            let img = await product.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            let imgs = [];
            let productImgs = await product.getProductImgs();
            for(let x in productImgs) {
                let productImg = productImgs[x];
                let img1 = await productImg.getCoverImg();
                imgs.push({ img_id: img1.get('id'), img_url: img1.get('url') })
            }
            let productTags = await product.getProductTags();
            let tags = [];
            for (let x in productTags) {
                let productTag = productTags[x];
                let tagId = productTag.get('tagId');
                let tag = await TagRepository.findOne({id: tagId});
                let tagTitle = tag.get('title');
                tags.push(tagTitle);
            }
            list.push(IndexProductViewModel.createIndexProductsViewModel(id, product_id, title, session, releaseTime, introduction, img_id, img_url, imgs, tags, rank));
        }
        ret['list'] = list.sort((a, b) => {
            return a.rank - b.rank;
        });
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
