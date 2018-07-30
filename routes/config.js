const router = require('koa-router')();

const ConfigRepository = require('../orm/repository/configRepository');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/config');

router.get('/footerLink', async (ctx, next) => {
    try {
        let footerLink = await ConfigRepository.findOrCreateOne('footer_link');
        let content = footerLink.content;
        if (content == null) content = '';
        let ret = {
            footerLink: content
        };
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.post('/footerLink', async (ctx, next) => {
    try {
        let content = ctx.request.body.content;
        if (!content) { ctx.response.body = ResponseService.createErrResponse('Content not found'); return; }
        await ConfigRepository.update('footer_link', content);
        let ret = 'success';
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
