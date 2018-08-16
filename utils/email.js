var nodemailer = require('nodemailer');
var conf = require('./config');

let pub = {};

pub.sendMail = async (email, content, name) => {
    var mailTransport = nodemailer.createTransport({
        host: conf.mail_host,
        auth: {
            user: conf.mail_user,
            pass: conf.mail_password,
        },
    });

    var send_to = "";
    conf.mail_to.forEach((item) => {
        send_to += '"MANAGER" <' + item + '>,'
    });
    send_to = send_to.substr(0, send_to.length - 1);

    var options = {
        from: '"From RegenIncoporated.com" <' + conf.mail_user + '>',
        to: send_to,
        // cc     : ''  //抄送
        // bcc     : ''  //密送
        subject: '[!]来自RegenIncoporated.com的表单',
        text: '[!]来自RegenIncoporated.com的表单',
        html: 
            '<h1>name</h1>' + '<p>' + name + '</p><br>' + 
            '<h1>email</h1>' + '<p>' + email + '</p><br>' +
            '<h1>content</h1>' + '<p>' + content + '</p><br>',
    };

    mailTransport.sendMail(options, function (err, msg) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(msg);
        }
    });
};

module.exports = pub;