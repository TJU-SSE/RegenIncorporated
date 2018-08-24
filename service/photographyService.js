const PhotographyRepository = require('../orm/repository/photographyRepository');
const PhotographyImgRepository = require('../orm/repository/photographyImgRepository');
const TagRepository = require('../orm/repository/tagRepository');
const PhotographyViewModel = require('../view_model/photography');
const config = require('../utils/config');
var ImgRepository = require('../orm/repository/imgRepository');

let pub = {};

pub.findOne = async (filter) => {
  return await PhotographyRepository.findOne(filter);
};

pub.create = async (title, introduction, title_cn, introduction_cn, cover_url, banner, banner_rank, tags) => {
  try {
    let photography = await PhotographyRepository.create(title, introduction, title_cn, introduction_cn, cover_url, banner, banner_rank, tags)
    
    let id = photography.get('id');
    return { id: id };
  } catch (e) {
    return e;
  }
};

pub.findAllFilter = async (filter) => {
  return await PhotographyRepository.findAllFilter(filter);
};

pub.search = async (key, filter) => {
  return await PhotographyRepository.search(key, filter);
};

pub.updateImg = async (photography, id, img_url) => {
  try {
    let newImg = await ImgRepository.create(id, img_url);
    await PhotographyRepository.updateImg(photography, newImg);
    return newImg.get('url');
  } catch (e) {
    return e;
  }
};

pub.update = async (photography, title, introduction, title_cn, introduction_cn, cover_url, banner, banner_rank, tags) => {
  try {
    await PhotographyRepository.update(photography, title, introduction, title_cn, introduction_cn, cover_url, banner, banner_rank, tags);
    return 'success';
  } catch (e) {
    return e;
  }
};

pub.addPhotographyImg = async (photography, id, img_url) => {
  try {
    let newImg = await ImgRepository.create(id, img_url);
    await PhotographyRepository.addPhotographyImg(photography, newImg);
    return {
      img_url: newImg.get('url'),
      img_id: newImg.get('id')
    };
  } catch (e) {
    return e;
  }
};

pub.addPhotographyImgs = async (photography, img_urls) => {
  try {
    let timestamp = Date.parse(new Date());
    for (let x in img_urls) {
      let img_url = img_urls[x];
      await pub.addPhotographyImg(photography, timestamp + x, img_url);
    }
    return 'success';
  } catch (e) {
    return e;
  }
};

pub.findPhotographyImg = async (photography, imgId) => {
  try {
    return await PhotographyRepository.findPhotographyImg(photography, imgId);
  } catch (e) {
    return null;
  }
};

pub.deletePhotographyImg = async (photographyImg) => {
  try {
    await PhotographyRepository.deletePhotographyImg(photographyImg);
    return 'success';
  } catch (e) {
    return e;
  }
};

pub.deletePhotographyImgs = async (photography, photographyIds) => {
  try {
    for (let x in photographyIds) {
      let photographyImg = await pub.findPhotographyImg(photography, photographyIds[x]);
      if (photographyImg) {
        await PhotographyRepository.deletePhotographyImg(photographyImg[0]);
      }
    }
    return 'success';
  } catch (e) {
    return e;
  }
};

pub.delete = async (filter) => {
  try {
    await PhotographyRepository.deleteOne(filter);
    return 'success';
  } catch (e) {
    return e;
  }
};

pub.createPhotographyViewModel = async (photography) => {
  try {
    let id = photography.get('id');
    let title = photography.get('photography');
    let introduction = photography.get('introduction');
    let title_cn = photography.get('title_cn');
    let introduction_cn = photography.get('introduction_cn');
    let cover_url = photography.get('cover_url');
    let banner = photography.get('banner');
    let banner_rank = photography.get('banner_rank');

    let imgs = [];
    let photographyImgs = await photography.getPhotographyImgs();
    for (let x in photographyImgs) {
      let photographyImg = photographyImgs[x];
      let img1 = await photographyImg.getCoverImg();
      imgs.push({ img_id: img1.get('id'), img_url: img1.get('url') })
    }
    let photographyTags = await photography.getPhotographyTags();
    let tags = [];
    for (let x in photographyTags) {
      let photographyTag = photographyTags[x];
      let tagId = photographyTag.get('tagId');
      let tag = await TagRepository.findOne({ id: tagId });
      let tagTitle = tag.get('title');
      tags.push(tagTitle);
    }

    return PhotographyViewModel.createPhotography(id, title, introduction, title_cn, introduction_cn, cover_url, imgs, tags, banner, banner_rank);
  } catch (e) {
    return e;
  }
};

pub.createPhotographiesViewModel = async (photographies, pageOffset, itemSize, withoutImgs = false, count = null, artistId = null, type = 0) => {
  try {
    let total = count !== null ? count : await PhotographyRepository.count();
    let ret = { 'pageOffset': pageOffset, 'itemSize': itemSize, 'total': total };
    let list = [];
    for (let x in photographies) {
      let photography = photographies[x];
      let id = photography.get('id');
      let title = photography.get('photography');
      let introduction = photography.get('introduction');
      let title_cn = photography.get('title_cn');
      let introduction_cn = photography.get('introduction_cn');
      let cover_url = photography.get('cover_url');
      let banner = photography.get('banner');
      let banner_rank = photography.get('banner_rank');

      let imgs = [];
      if (!withoutImgs) {
        let photographyImgs = await photography.getPhotographyImgs();
        for (let x in photographyImgs) {
          let photographyImg = photographyImgs[x];
          let img1 = await photographyImg.getCoverImg();
          imgs.push({ img_id: img1.get('id'), img_url: img1.get('url') })
        }
      }
      let photographyTags = await photography.getPhotographyTags();
      let tags = [];
      for (let x in photographyTags) {
        let photographyTag = photographyTags[x];
        let tagId = photographyTag.get('tagId');
        let tag = await TagRepository.findOne({ id: tagId });
        let tagTitle = tag.get('title');
        tags.push(tagTitle);
      }

      list.push(PhotographyViewModel.createPhotography(id, title, introduction, title_cn, introduction_cn, cover_url, imgs, tags, banner, banner_rank));
    }
    ret['photographies'] = list;
    return ret;
  } catch (e) {
    return e;
  }
};

module.exports = pub;
