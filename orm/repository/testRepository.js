const Test = require('../model/test');

let pub = {};

pub.findAll = async () => {
	let res = await Test.findAll();
    var ret = [];
    for(var x in res) {
        var data = res[x].dataValues;
        var resData = {'id': data.id, 'name': data.name, 'url': data.url};
        ret.push(resData);
    }
    return ret;
};

pub.findOne = async (filter) => {
    let res = await Test.findOne({where: filter});
    return res;
};

pub.create = async (name, url) =>{
    return await Test.create({
        name: name,
        url: url
    });
};

pub.deleteOne = async (test) => {
    await test.destroy();
};

module.exports = pub;
