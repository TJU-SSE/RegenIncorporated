let pub = {};

pub.createPhotography = function (id, title, introduction, title_cn, introduction_cn, cover_url, imgs = [], tags = [], banner = false, banner_rank = 0) {
  return {
    id: id,
    title: title,
    introduction: introduction,
    title_cn: title_cn,
    introduction_cn: introduction_cn,
    cover_url: cover_url,
    imgs: imgs,
    tags: tags,
    banner: banner,
    banner_rank: banner_rank
  };
};

module.exports = pub;
