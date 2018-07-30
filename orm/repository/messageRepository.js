const Message = require('../model/message');

let pub = {};

pub.findAll = async () => {
    let res = await Message.findAll();
    return res;
};

pub.create = async (email, content, varificationCode) => {
    let message = await Message.create({ email: email, content: content, varificationCode: varificationCode, beenReaded: false});
    return message;
};

pub.readOne = async (filter) => {
    let res = await Message.findOne({where: filter});
    if(res) {
        res.beenReaded = true;
    }
    return res;
};

pub.deleteOne = async (filter) => {
    let message = await pub.findOne(filter);
    if (message) {
        await message.destroy();
    }
};

module.exports = pub;