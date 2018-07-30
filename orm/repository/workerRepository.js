const Worker = require('../model/worker');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.getTotalSize = async () => {
    return await Worker.count();
};

pub.findAll = async () => {
    let res = await Worker.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Worker.findAll(filter);
    return res;
};

pub.findOne = async (filter) => {
    let res = await Worker.findOne({where: filter});
    return res;
};

pub.create = async (name, email, rank, img, identity) =>{
    let worker = await Worker.create({ name: name, email: email, rank: rank, identity: identity });
    worker.setCoverImg(img);
    return worker;
};

pub.updateImg = async (worker, img) => {
    let oldImg = await worker.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    worker.setCoverImg(img);
};

pub.update = async (worker, name, email, desc, rank) => {
    if(name) worker.name = name;
    if(email) worker.email = email;
    if(desc) worker.desc = desc;
    if(rank) worker.rank = rank;
    await worker.save();
};

pub.updateRank = async (worker, rank) => {
    worker.rank = rank;
    await worker.save();
};

pub.deleteOne = async (filter) => {
    let worker = await pub.findOne(filter);
    if (worker) {
        let img = await worker.getCoverImg();
        await Qiniu.deleteFile(img);
        await worker.destroy();
    }
};

module.exports = pub;
