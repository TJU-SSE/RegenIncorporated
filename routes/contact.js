const router = require('koa-router')();

const ContactRepository = require('../orm/repository/contactRepository');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/contact');


// OK
router.get('/get', async (ctx, next) => {
    try {
        let ret = await ContactRepository.get();
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/update', async (ctx, next) => {
    try {
        let phone = ctx.request.body.phone || '';
        let photography = ctx.request.body.photography || '';
        let fax = ctx.request.body.fax || '';
        let address = ctx.request.body.address || '';
        let link = ctx.request.body.link || '';
        let social = ctx.request.body.social || '';
        let desc = ctx.request.body.desc || '';
        let ret = await ContactRepository.update(phone, photography, fax, address, link, social, desc);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateImg',  async (ctx, next) => {
    try {
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await ContactRepository.updateImg(timestamp, file.path);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
