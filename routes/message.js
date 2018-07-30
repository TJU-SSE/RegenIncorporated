const router = require('koa-router')();
const MessageService = require('../service/messageService.js');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/message');

// Not tested yet
router.post('/create', async (ctx, next) => {
    try {
        let email = ctx.request.body.email || '未填写';
        let content = ctx.request.body.content || '未填写';
        let varificationCode = ctx.request.body.varificationCode || '未填写';
        let ret = await MessageService.create(email, content, varificationCode);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
