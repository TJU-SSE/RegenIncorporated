const router = require('koa-router')();

const TagService = require('../service/tagService');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/tag');


// OK
router.get('/findAll', async (ctx, next) => {
    try {
        let ret = await TagService.findAll();
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/create', async (ctx, next) => {
    try {
        let title = ctx.request.body.title;
        if (!title) { ctx.response.body = ResponseService.createErrResponse('Title not found'); return; };
        let ret = await TagService.create(title);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/update', async (ctx, next) => {
    try {
        let id = ctx.request.body.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let tag = await TagService.findOne({id: id});
        if (!tag) { ctx.response.body = ResponseService.createErrResponse('Tag not found'); return; }
        let title = ctx.request.body.title || '';
        let ret = await TagService.update(tag, title);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/delete', async (ctx, next) => {
    try {
        let id = ctx.request.body.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let tag = await TagService.findOne({id: id});
        if (!tag) { ctx.response.body = ResponseService.createErrResponse('Tag not found'); return; }
        let ret = await TagService.delete(tag);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
