const PhotographyImg = require('../model/photographyImg');

let pub = {};

pub.findAll = async () => {
  let res = await PhotographyImg.findAll();
  return res;
};

pub.findOne = async (filter) => {
  let res = await PhotographyImg.findOne({ where: filter });
  return res;
};

pub.create = async (img) => {
  let photographyImg = await PhotographyImg.create({});
  photographyImg.setCoverImg(img);
  return photographyImg;
};

pub.updateImg = async (photographyImg, img) => {
  let oldImg = await photographyImg.getCoverImg();
  await oldImg.destroy();
  photographyImg.setCoverImg(img);
};

pub.deleteOne = async (filter) => {
  let photographyImg = await pub.findOne(filter);
  if (photographyImg) {
    let img = await photographyImg.getCoverImg();
    await img.destroy();
    await photographyImg.destroy();
  }
};

pub.delete = async (photographyImg) => {
  let img = await photographyImg.getCoverImg();
  await img.destroy();
  await photographyImg.destroy();
};

module.exports = pub;
