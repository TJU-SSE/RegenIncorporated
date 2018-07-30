const Qiniu = require('../utils/qiniu');

let pub = {};


pub.create = async (key, localFile) => {
    try {
        let ret = {};
        await Qiniu.uploadFile(key, localFile, async function (img) {
            ret.id = img.get('id');
            ret.url = img.get('url');
        });
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
