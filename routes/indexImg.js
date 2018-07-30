const router = require('koa-router')();

const IndexImgService = require('../service/indexImgService');
const NewsService = require('../service/newsService');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/indexImg');


// OK
router.get('/getAll', async (ctx, next) => {
    try {
        let indexImgs = await IndexImgService.findAll();
        let ret = await IndexImgService.createIndexImgsViewModel(indexImgs);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/create', async (ctx, next) => {
    try {
        let newsId = ctx.request.body.fields.newsId;
        if (!newsId) { ctx.response.body = ResponseService.createErrResponse('NewsId not found'); return; }
        let news = await NewsService.findOne({id: newsId});
        if (!news) { ctx.response.body = ResponseService.createErrResponse('News not found'); return; }
        let rank = ctx.request.body.fields.rank;
        if (!rank) { ctx.response.body = ResponseService.createErrResponse('Rank not found'); return; }
        let ret = await IndexImgService.create(news, rank);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateRanks', async (ctx, next) => {
    try {
        let ranks = ctx.request.body;
        let ret = await IndexImgService.updateRanks(ranks);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/delete', async (ctx, next) => {
    try {
        let id = ctx.request.body.newsId;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let indexImg = await IndexImgService.findOne({id: id});
        if (!indexImg) { ctx.response.body = ResponseService.createErrResponse('IndexImg not found'); return; }
        let ret = await IndexImgService.delete(indexImg);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteIndexImgs', async (ctx, next) => {
    try {
        let ids = ctx.request.body.newsIds;
        if (!ids) { ctx.response.body = ResponseService.createErrResponse('Ids not found'); return; }
        let ret = await IndexImgService.deleteIndexImgs(ids);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
