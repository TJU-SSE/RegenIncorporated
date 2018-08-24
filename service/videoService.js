const VideoRepository = require('../orm/repository/videoRepository');
const Qiniu = require('../utils/qiniu');
const config = require('../utils/config');


let pub = {};

pub.findOne = async (filter) => {
  return await VideoRepository.findOne(filter);
};

pub.create = async (title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner) => {
  try {
    let v = null;
    v = await VideoRepository.create(title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner);
    let id = v.get('id');
    return { id: id };
  } catch (e) {
    return e;
  }
};

pub.findAllFilter = async (filter) => {
  return await VideoRepository.findAllFilter(filter);
};

pub.search = async (key, filter) => {
  return await VideoRepository.search(key, filter);
};

pub.update = async (v, title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner) => {
  try {
    await VideoRepository.update(v, title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner);
    return 'success';
  } catch (e) {
    return e;
  }
};

pub.delete = async (filter) => {
  try {
    await VideoRepository.deleteOne(filter);
    return 'success';
  } catch (e) {
    return e;
  }
};

pub.wrap = (id, title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner) => {
  return {
    id: id,
    title: title,
    desc: desc,
    intro: intro,
    title_cn: title_cn,
    desc_cn: desc_cn,
    intro_cn: intro_cn,
    cover: cover,
    video: video,
    rank: rank,
    banner: banner
  };
}

pub.createVideoViewModel = async (v) => {
  try {
    let id = v.get('id');
    let title = v.get('title');
    let desc = v.get('desc');
    let intro = v.get('intro');
    let title_cn = v.get('title_cn');
    let desc_cn = v.get('desc_cn');
    let intro_cn = v.get('intro_cn');
    let cover = v.get('cover');
    let video = v.get('video')
    let rank = v.get('rank');
    let banner = v.get('banner');

    return pub.wrap(id, title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner);
  } catch (e) {
    return e;
  }
};

pub.createVideosViewModel = async (videos, pageOffset, itemSize, count = null) => {
  try {
    let total = count !== null ? count : await VideoRepository.count();
    let ret = { 'pageOffset': pageOffset, 'itemSize': itemSize, 'total': total };
    let list = [];
    for (let x in videos) {
      let v = videos[x];
      let id = v.get('id');
      let title = v.get('title');
      let desc = v.get('desc');
      let intro = v.get('intro');
      let title_cn = v.get('title_cn');
      let desc_cn = v.get('desc_cn');
      let intro_cn = v.get('intro_cn');
      let cover = v.get('cover');
      let video = v.get('video')
      let rank = v.get('rank');
      let banner = v.get('banner');

      list.push(pub.wrap(id, title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner));
    }
    ret['videos'] = list;
    return ret;
  } catch (e) {
    return e;
  }
};

module.exports = pub;
