const router = require('koa-router')();

const CooperationService = require('../service/cooperationService');
const PortfolioService = require('../service/portfolioService');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/cooperation');


// OK
router.get('/select/:id', async (ctx, next) => {
    try {
        // let id = ctx.request.body.id;
        let id = ctx.params.id;
        // console.log(ctx.query);
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let cooperation = await CooperationService.findOne({id: id});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let ret = await CooperationService.createCooperationViewModel(cooperation);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/create', async (ctx, next) => {
    try {
        let file = ctx.request.body.files.img;
        let title = ctx.request.body.fields.title || '';
        let releaseTime = ctx.request.body.fields.releaseTime || 0;
        let description = ctx.request.body.fields.description || '';
        let timestamp = Date.parse(new Date());
        let ret = await CooperationService.create(timestamp, file.path, title, releaseTime, description);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateImg',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let cooperation = await CooperationService.findOne({id: id});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let portfolio = await CooperationService.getPortfolio(cooperation);
        if (!portfolio) { ctx.response.body = ResponseService.createErrResponse('Portfolio not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await PortfolioService.updateImg(portfolio, timestamp, file.path);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/update', async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let cooperation = await CooperationService.findOne({id: id});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let title = ctx.request.body.fields.title || '';
        let releaseTime = ctx.request.body.fields.releaseTime || 0;
        let description = ctx.request.body.fields.description || '';
        let ret = await CooperationService.update(cooperation, title, releaseTime, description);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/addImg',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let cooperation = await CooperationService.findOne({id: id});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let portfolio = await CooperationService.getPortfolio(cooperation);
        if (!portfolio) { ctx.response.body = ResponseService.createErrResponse('Portfolio not found'); return; }
        let rank = ctx.request.body.fields.rank || 0;
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await PortfolioService.addPortfolioImg(portfolio, rank, timestamp, file.path);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/addImgs',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let cooperation = await CooperationService.findOne({id: id});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let portfolio = await CooperationService.getPortfolio(cooperation);
        if (!portfolio) { ctx.response.body = ResponseService.createErrResponse('Portfolio not found'); return; }
        let rank = ctx.request.body.fields.rank || 0;
        let files = ctx.request.body.files.imgs;
        let ret = await PortfolioService.addPortfolioImgs(portfolio, rank, files);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteImg',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let cooperation = await CooperationService.findOne({id: id});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let portfolio = await CooperationService.getPortfolio(cooperation);
        if (!portfolio) { ctx.response.body = ResponseService.createErrResponse('Portfolio not found'); return; }
        let imgId = ctx.request.body.fields.imgId;
        if (!imgId) { ctx.response.body = ResponseService.createErrResponse('Img Id not found'); return; }
        let portfolioImg = await PortfolioService.findPortfolioImg(portfolio, imgId);
        if (!portfolioImg) { ctx.response.body = ResponseService.createErrResponse('Img not found'); return; }
        let ret = await PortfolioService.deletePortfolioImg(portfolioImg[0]);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteImgs',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let cooperation = await CooperationService.findOne({id: id});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let portfolio = await CooperationService.getPortfolio(cooperation);
        if (!portfolio) { ctx.response.body = ResponseService.createErrResponse('Portfolio not found'); return; }
        let imgIds = ctx.request.body.fields.imgIds;
        if (!imgIds) { ctx.response.body = ResponseService.createErrResponse('Img Id not found'); return; }
        let ret = await PortfolioService.deletePortfolioImgs(portfolio, imgIds);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateRanks', async (ctx, next) => {
    try {
        let id = ctx.request.body.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let cooperation = await CooperationService.findOne({id: id});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let portfolio = await CooperationService.getPortfolio(cooperation);
        if (!portfolio) { ctx.response.body = ResponseService.createErrResponse('Portfolio not found'); return; }
        let imgRanks = ctx.request.body.imgRanks;
        let ret = await PortfolioService.updateRanks(portfolio, imgRanks);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/delete', async (ctx, next) => {
    try {
        let id = ctx.request.body.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let ret = await CooperationService.delete({id: id});
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
