const User = require('../model/user');

let pub = {};

pub.findAll = async () => {
    let res = await User.findAll();
    return res;
};

pub.findOne = async (filter) => {
    let res = await User.findOne({where: filter});
    return res;
};

pub.create = async (username, password) =>{
    return await User.create({
        username: username,
        password: password
    });
};

pub.deleteOne = async (user) => {
    await user.destroy();
};

module.exports = pub;
