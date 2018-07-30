const Contact = require('../model/contact');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.get = async () => {
    let res = await Contact.findOne({id: 1});
    return res;
};

pub.updateImg = async (key, localFile) => {
    try {
        let contact = await pub.get();
        let oldImg = await contact.getCoverImg();
        if (oldImg) {
            let oldImg = await contact.getCoverImg();
            await Qiniu.deleteFile(oldImg);
        }
        let newImg = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            newImg = img;
            await contact.setCoverImg(img);
        });
        return newImg.get('url');
    } catch (e) {
        return e;
    }
};

pub.update = async (phone, photography, fax, address, link, social, desc) => {
    try {
        let contact = await pub.get();
        if(phone) contact.phone = phone;
        if(photography) contact.photography = photography;
        if(fax) contact.fax = fax;
        if(address) contact.address = address;
        if(link) contact.link = link;
        if(social) contact.social = social;
        if(desc) contact.desc = desc;
        console.log('before save-----------', contact)
        await contact.save();
      console.log('after save-----------', contact)
        return 'success';
    } catch (e) {
        return e;
    }
};

module.exports = pub;
