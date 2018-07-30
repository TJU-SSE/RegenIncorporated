const Img = require('../model/img');

let pub = {};

pub.findAll = async () => {
    let res = await Img.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await Img.findOne({where: filter});
    return res;
};

pub.create = async (id, url) =>{
    return await Img.create({
        id: id,
        url: url
    });
};

pub.deleteOne = async (img) => {
    await img.destroy();
};

module.exports = pub;
