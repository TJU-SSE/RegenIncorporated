const ProductRepository = require('../orm/repository/productRepository');
const ProductImgRepository = require('../orm/repository/productImgRepository');
const TagRepository = require('../orm/repository/tagRepository');
const ArtistService = require('../service/artistService');
const ArtistRepository = require('../orm/repository/artistRepository');
const ProductViewModel = require('../view_model/product');
const IndexProductRepository = require('../orm/repository/indexProductRepository');
const Qiniu = require('../utils/qiniu');
const config = require('../utils/config');

let pub = {};

pub.findOne = async (filter) => {
    return await ProductRepository.findOne(filter);
};

pub.create = async (key, localFile, title, session, releaseTime, introduction, tags, banner, banner_rank) => {
    try {
        let product = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            product = await ProductRepository.create(title, session, releaseTime, introduction, img, tags, banner, banner_rank);
        });
        let id = product.get('id');
        return {id: id};
    } catch (e) {
        return e;
    }
};

pub.findAllFilter = async (filter) => {
    return await ProductRepository.findAllFilter(filter);
};

pub.search = async (key, filter) => {
    return await ProductRepository.search(key, filter);
};

pub.updateImg = async (product, key, localFile) => {
    try {
        let newImg = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await ProductRepository.updateImg(product, img);
            newImg = img
        });
        return newImg.get('url');
    } catch (e) {
        return e;
    }
};

pub.update = async (product, title, session, releaseTime, introduction, tags, banner, banner_rank) => {
    try {
        await ProductRepository.update(product, title, session, releaseTime, introduction, tags, banner, banner_rank);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.addProductImg = async (product, key, localFile) => {
    try {
        let newImg = null
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await ProductRepository.addProductImg(product, img);
            newImg = img
        });
        return {
            img_url: newImg.get('url'),
            img_id: newImg.get('id')
        };
    } catch (e) {
        return e;
    }
};

pub.addProductImgs = async (product, files) => {
    try {
        let timestamp = Date.parse(new Date());
        for(let x in files) {
            let localFile = files[x].path;
            await pub.addProductImg(product, timestamp + x, localFile);
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.findProductImg = async (product, imgId) => {
    try {
        return await ProductRepository.findProductImg(product, imgId);
    } catch (e) {
        return null;
    }
};

pub.deleteProductImg = async (productImg) => {
    try {
        await ProductRepository.deleteProductImg(productImg);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteProductImgs = async (product, productIds) => {
    try {
        for(let x in productIds) {
            let productImg = await pub.findProductImg(product, productIds[x]);
            if (productImg) {
                await ProductRepository.deleteProductImg(productImg[0]);
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await ProductRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createProductViewModel = async (product) => {
    try {
        let id = product.get('id');
        let title = product.get('title');
        let session = product.get('session');
        let releaseTime = product.get('releaseTime');
        let introduction = product.get('introduction');
        let banner = product.get('banner');
        let banner_rank = product.get('banner_rank');
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

        const indexProduct = await IndexProductRepository.findOne({product_id: id});
        console.log('indexProduct', indexProduct)
        let index = {
            id: -1,
            rank: 0
        };
        if (indexProduct) {
            index = {
                id: indexProduct.get('id'),
                rank: indexProduct.get('rank')
            }
        }

        return ProductViewModel.createProduct(id, title, session, releaseTime, introduction, img_id, img_url, imgs, tags, -1, index, banner, banner_rank);
    } catch (e) {
        return e;
    }
};

pub.selectWithArtists = async (product) => {
    try {
        let id = product.get('id');
        let title = product.get('title');
        let session = product.get('session');
        let releaseTime = product.get('releaseTime');
        let introduction = product.get('introduction');
        let banner = product.get('banner');
        let banner_rank = product.get('banner_rank');
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
        let ret = {};
        ret['product'] = ProductViewModel.createProduct(id, title, session, releaseTime, introduction, img_id, img_url, imgs, tags, -1, null, banner, banner_rank);
        let artistProducts = await product.getArtistProducts();
        let achievements = await product.getAchievements();
        let list = [];
        for (let x in artistProducts) {
            let artistProduct = artistProducts[x];
            let artist = await ArtistRepository.findOne({id: artistProduct.get('artistId')});
            let id = artist.get('id');
            let name = artist.get('name');
            let identity = artist.get('identity');
            let img = await artist.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push({id: id, name: name, identity: identity, img_id: img_id, img_url: img_url});
        }
        for (let x in achievements) {
            let achievement = achievements[x];
            let artist = await ArtistRepository.findOne({id: achievement.get('artistId')});
            let id = artist.get('id');
            let name = artist.get('name');
            let identity = artist.get('identity');
            let img = await artist.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push({id: id, name: name, identity: identity, img_id: img_id, img_url: img_url});
        }
        ret['artists'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.createProductsViewModel = async (products, pageOffset, itemSize, withoutImgs = false, count = null, artistId = null, type = 0) => {
    try {
        let total = count !== null ? count : await ProductRepository.count();
        let ret = {'pageOffset': pageOffset, 'itemSize': itemSize, 'total': total};
        let list = [];
        for (let x in products) {
            let product = products[x];
            let id = product.get('id');
            let title = product.get('title');
            let session = product.get('session');
            let releaseTime = product.get('releaseTime');
            let introduction = product.get('introduction');
            let banner = product.get('banner');
            let banner_rank = product.get('banner_rank');
            let img = await product.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            let imgs = [];
            if (!withoutImgs) {
              let productImgs = await product.getProductImgs();
              for(let x in productImgs) {
                let productImg = productImgs[x];
                let img1 = await productImg.getCoverImg();
                imgs.push({ img_id: img1.get('id'), img_url: img1.get('url') })
              }
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

            const indexProduct = await IndexProductRepository.findOne({product_id: id});
            let index = {
                id: -1,
                rank: 0
            };
            if (indexProduct) {
                index = {
                  id: indexProduct.get('id'),
                  rank: indexProduct.get('rank')
                }
            }

            let rank = -1;
            if (artistId) {
                let artistProduct;
                if (type === config.ARTIST_PRODUCT_TYPES.UPDATE) {
                    artistProduct = await ArtistService.findArtistProduct({productId: id, artistId: artistId});
                    console.log('ARTIST_PRODUCT_TYPES')
                } else if (type === config.ARTIST_PRODUCT_TYPES.ACHIEVEMENT) {
                    artistProduct = await ArtistService.findAchievement({productId: id, artistId: artistId})
                  console.log('ARTIST_PRODUCT_TYPES achi')
                }
                if (artistProduct) {
                    rank = artistProduct.get('rank');
                }
            }

            list.push(ProductViewModel.createProduct(id, title, session, releaseTime, introduction, img_id, img_url, imgs, tags, rank, index, banner, banner_rank));
        }
        ret['products'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.createProductsViewModelWithRank = async (products, pageOffset, itemSize, artistId,
                                             type = config.ARTIST_PRODUCT_TYPES.UPDATE) => {
  try {
    let total = await ProductRepository.count();
    let ret = {'pageOffset': pageOffset, 'itemSize': itemSize, 'total': total};
    let list = [];
    for (let x in products) {
      let product = products[x];
      let id = product.get('id');
      let title = product.get('title');
      let session = product.get('session');
      let releaseTime = product.get('releaseTime');
      let introduction = product.get('introduction');
      let banner = product.get('banner');
      let banner_rank = product.get('banner_rank');
      let img = await product.getCoverImg();
      let img_id = img.get('id');
      let img_url = img.get('url');

      let artistProduct = null;
      if (type === config.ARTIST_PRODUCT_TYPES.UPDATE) {
          artistProduct = await ArtistService.findArtistProduct({productId: id, artistId: artistId});
      } else if (type === config.ARTIST_PRODUCT_TYPES.ACHIEVEMENT) {
          artistProduct = await ArtistService.findAchievement({productId: id, artistId: artistId})
      }
      let rank = -1;
      if (artistProduct) {
          rank = artistProduct.get('rank');
      }
      let imgs = [];
      let tags = [];
      list.push(ProductViewModel.createProduct(id, title, session, releaseTime, introduction, img_id, img_url, imgs, tags, rank, null, banner, banner_rank));
    }

    ret['products'] = list;
    return ret;
  } catch (e) {
    return e;
  }
};

module.exports = pub;
