const Session = require('../model/session');

let pub = {};

pub.findAll = async () => {
    let res = await Session.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await Session.findOne({where: filter});
    return res;
};

pub.create = async (sessionId, username) =>{
    return await Session.create({
        id: sessionId,
        username: username
    });
};

pub.deleteOne = async (session) => {
    await session.destroy();
};

module.exports = pub;
