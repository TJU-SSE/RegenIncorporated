var qiniu = require('qiniu');
var conf = require('./config');
var ImgRepository = require('../orm/repository/imgRepository');

let pub = {};

qiniu.conf.ACCESS_KEY = conf.ACCESS_KEY;
qiniu.conf.SECRET_KEY = conf.SECRET_KEY;

let _uploadFile = async function(key, localFile, callback, res) {
    key += '';
    var putPolicy = new qiniu.rs.PutPolicy(conf.bucket + ":" + key);
    var token = putPolicy.token();
    var extra = new qiniu.io.PutExtra();
    console.log(key + ' ' + localFile);
    await qiniu.io.putFile(token, key, localFile, extra, async function(err, ret) {
        if (!err) {
            let url = conf.download + ret.key;
            let policy = new qiniu.rs.GetPolicy();
            let downloadUrl = policy.makeRequest(url);
            console.log('Rep: ' + ret.key + ' ' + downloadUrl);
            let img = await ImgRepository.create(ret.key, downloadUrl);
            await callback(img);
            res();
        } else {
            console.log(err);
        }
    });
};

let _deleteFile = async function (img, res) {
    var client = new qiniu.rs.Client();
    var bucket = conf.bucket;
    var key = img.get('id') + '';
    console.log(key);
    client.remove(bucket, key, async function(err, ret) {
        if (!err) {
            await ImgRepository.deleteOne(img);
            res();
        } else {
            console.log(err);
        }
    });
};

pub.uploadFile = async (key, localFile, callback) => {
    // await new Promise((resolve, reject) => {
    //     _uploadFile(key, localFile, callback, async function () {
    //         resolve();
    //     });
    // });
};

pub.deleteFile = async (img) => {
    // await new Promise((resolve, reject) => {
    //     _deleteFile(img, async function () {
    //         resolve();
    //     });
    // });
};

module.exports = pub;
