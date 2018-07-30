const Email = require('../utils/email.js');
const MessageRepository = require('../orm/repository/messageRepository')

let pub = {};

pub.create = async (email, content, name) => {
    try {
        let message = null;
        message = await MessageRepository.create(email, content, name);
        console.log("开始发送邮件");
        await Email.sendMail(email, content, name);
        console.log("邮件发送完毕");
        let id = message.get('id');
        return { id: id };
    } catch (e) {
        console.log(e);
        return e;
    }
};


module.exports = pub;

