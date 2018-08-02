const router = require('koa-router')();

const ContactRepository = require('../orm/repository/contactRepository');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/contact');


router.get('/getall', async (ctx, next) => {
    try {
        let ret = await ContactRepository.findAll();
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
})

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
        ctx.request.body.msg.forEach(async (item) =>  {
            let phone = item.phone || '';
            let photography = item.photography || '';
            let fax = item.fax || '';
            let address = item.address || '';
            let link = item.link || '';
            let social = item.social || '';
            let desc = item.desc || '';
            let id = item.id || '';
            let city_name = item.city_name || '';
            let ret = await ContactRepository.update(phone, photography, fax, address, link, social, desc, id, city_name);
        });
        ctx.response.body = ResponseService.createJSONResponse("success");
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
