const Video = require('../model/video');
const Qiniu = require('../../utils/qiniu');
var TagRepository = require("./tagRepository.js");
const Helper = require('../../utils/helper');

let pub = {};

pub.findAll = async () => {
  let res = await Video.findAll();
  return res;
};

pub.findAllFilter = async (filter) => {
  filter['order'] = filter['order'] ? filter['order'] : 'updatedAt DESC';
  let res = await Video.findAll(filter);
  return res;
};

pub.search = async (key, filter) => {
  filter['where'] = {
    title: {
      $like: '%' + key + '%'
    }
  };
  filter['order'] = 'updatedAt DESC';
  let res = await Video.findAndCountAll(filter);
  return res;
};

pub.findOne = async (filter) => {
  let res = await Video.findOne({ where: filter });
  return res;
};

pub.count = async () => {
  return await Video.count();
};

pub.create = async (title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner) => {
  let v = await Video.create({ title: title, desc: desc, intro: intro, 
    title_cn: title_cn, desc_cn: desc_cn, intro_cn: intro_cn,
    cover: cover, video: video, rank: rank, banner: banner});

  return v;
};

pub.update = async (v, title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner) => {
  if (title) v.title = title;
  if (desc) v.desc = desc;
  if (intro) v.intro = intro;
  if (title_cn) v.title_cn = title_cn;
  if (desc_cn) v.desc_cn = desc_cn;
  if (intro_cn) v.title = title;
  if (cover) v.cover = cover;
  if (video) v.video = video;
  if (rank) v.rank = rank;
  if (Helper.containsBool(banner)) v.banner = banner;
  await v.save();
};

pub.deleteOne = async (filter) => {
  let video = await pub.findOne(filter);
  if (video) {
    await video.destroy();
  }
};

module.exports = pub;
