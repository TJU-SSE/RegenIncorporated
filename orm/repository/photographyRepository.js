const Photography = require('../model/photography');
const Helper = require('../../utils/helper');
const PhotographyImgRepository = require('./photographyImgRepository');
const PhotographyTagRepository = require('./photographyTagRepository');
var TagRepository = require("./tagRepository.js");

let pub = {};

pub.findAll = async () => {
  let res = await Photography.findAll();
  return res;
};

pub.findAllFilter = async (filter) => {
  filter['order'] = filter['order'] ? filter['order'] : 'updatedAt DESC';
  let res = await Photography.findAll(filter);
  return res;
};

pub.search = async (key, filter) => {
  filter['where'] = {
    title: {
      $like: '%' + key + '%'
    }
  };
  filter['order'] = 'updatedAt DESC';
  let res = await Photography.findAndCountAll(filter);
  return res;
};

pub.findOne = async (filter) => {
  let res = await Photography.findOne({ where: filter });
  return res;
};

pub.findPhotographyImg = async (photography, imgId) => {
  return photography.getPhotographyImgs({
    'where': {
      cover_img: imgId
    }
  });
};

pub.count = async () => {
  return await Photography.count();
};

pub.create = async (title, introduction, title_cn, introduction_cn, cover_url, banner, banner_rank, tags) => {
  let photography = await Photography.create({
    title: title, introduction: introduction, title_cn: title_cn, cover_url: cover_url, 
    introduction_cn: introduction_cn, banner: banner, banner_rank: banner_rank});
  let photographyTags = [];
  for (let x in tags) {
    let tagTitle = tags[x];
    let tag = await TagRepository.findOrCreate(tagTitle);
    let photographyTag = await PhotographyTagRepository.create(photography, tag);
    photographyTags.push(photographyTag);
  }
  await photography.setPhotographyTags(photographyTags);
  return photography;
};

// pub.updateImg = async (photography, img) => {
//   photography.cover_url = img.get('url');
//   await photography.save();
// };

pub.addPhotographyImg = async (photography, img) => {
  let imgs = await photography.getPhotographyImgs();
  let photographyImg = await PhotographyImgRepository.create(img);
  imgs.push(photographyImg);
  photography.setPhotographyImgs(imgs);
};

pub.deletePhotographyImg = async (photographyImg) => {
  console.log(photographyImg);
  await PhotographyImgRepository.delete(photographyImg);
};

pub.update = async (photography, title, introduction, title_cn, introduction_cn, cover_url, banner, banner_rank, tags) => {
  if (title) photography.title = title;
  if (title_cn) photography.title_cn = title_cn;
  if (introduction) photography.introduction = introduction;
  if (introduction_cn) photography.introduction_cn = introduction_cn;
  if (cover_url) photography.cover_url = cover_url;
  
  if (tags) {
    let oldTags = await photography.getPhotographyTags();
    for (let x in oldTags) {
      let photographyTag = oldTags[x];
      await PhotographyTagRepository.delete(photographyTag);
    }
    let photographyTags = [];
    for (let x in tags) {
      let tagTitle = tags[x];
      let tag = await TagRepository.findOrCreate(tagTitle);
      let photographyTag = await PhotographyTagRepository.create(photography, tag);
      photographyTags.push(photographyTag);
    }
    await photography.setPhotographyTags(photographyTags);
  }
  if (Helper.containsBool(banner)) photography.banner = banner;
  if (banner_rank) photography.banner_rank = banner_rank;

  await photography.save();
};

pub.deleteOne = async (filter) => {
  let photography = await pub.findOne(filter);
  if (photography) {
    let imgs = await photography.getPhotographyImgs();
    for (let x in imgs) {
      let img1 = imgs[x];
      await PhotographyImgRepository.delete(img1);
    }
    let photographyTags = await photography.getPhotographyTags();
    for (let x in photographyTags) {
      let photographyTag = photographyTags[x];
      await photographyTag.destroy();
    }
    await photography.destroy();
  }
};

module.exports = pub;
