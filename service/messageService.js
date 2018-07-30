const Email = require('../utils/email.js');
const MessageRepository = require('../orm/repository/messageRepository')

let pub = {};

pub.create = async (email, content, varificationCode) => {
    try {
        let message = null;
        message = await MessageRepository.create(email, content, varificationCode);
        console.log("开始发送邮件");
        await Email.sendMail(email, content, varificationCode);
        console.log("邮件发送完毕");
        let id = message.get('id');
        return { id: id };
    } catch (e) {
        console.log(e);
        return e;
    }
};


module.exports = pub;

