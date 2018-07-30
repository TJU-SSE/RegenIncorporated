const Config = require('../model/config');

let pub = {};

pub.findOrCreateOne = async (key) => {
    let config = await Config.findOne({where:{id: key}});
    if (!config) {
        config = await Config.create({ id: key });
    }
    return config;
};

pub.update = async (key, content) => {
    try {
        let config = await pub.findOrCreateOne(key);
        config.content = content;
        config.save();
        return true;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
