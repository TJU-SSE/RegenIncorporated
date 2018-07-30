const router = require('koa-router')();

const ShowService = require('../service/showService');
const DesignerService = require('../service/designerService');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/show');


// OK
router.get('/select/:id', async (ctx, next) => {
    try {
        let id = ctx.params.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let show = await ShowService.findOne({id: id});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let ret = await ShowService.createShowViewModel(show);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/selectByName/:name', async (ctx, next) => {
    try {
        let name = ctx.params.name;
        if (!name) { ctx.response.body = ResponseService.createErrResponse('Name not found'); return; }
        let show = await ShowService.findOne({name: name});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let ret = await ShowService.createShowViewModel(show);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/search/:name',  async (ctx, next) => {
    try {
        let name = ctx.params.name;
        if (!name) { ctx.response.body = ResponseService.createErrResponse('Name not found'); return; }
        let ret = await ShowService.search(name);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/getAll',  async (ctx, next) => {
    try {
        let pageOffset = ctx.query.pageOffset || 0;
        let itemSize = ctx.query.itemSize || 20;
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let ret = await ShowService.getAll(pageOffset, itemSize);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/getAllByDesignerId/:id',  async (ctx, next) => {
    try {
        let id = ctx.params.id;
        let ret = await ShowService.getAllByDesignerId(id);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.get('/getAllBySeason/:year/:season',  async (ctx, next) => {
    try {
        let year = ctx.params.year;
        let season = ctx.params.season;
        let ret = await ShowService.getAllBySeason(year, season);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.get('/getSeasons',  async (ctx, next) => {
    try {
        let ret = await ShowService.getSeasons();
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.post('/createSeason',  async (ctx, next) => {
    try {
        let year = ctx.request.body.fields.year;
        if (!year) { ctx.response.body = ResponseService.createErrResponse('year not found'); return; }
        let season = ctx.request.body.fields.season;
        if (!season) { ctx.response.body = ResponseService.createErrResponse('season not found'); return; }
        let ret = await ShowService.createSeason(year, season);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.post('/deleteSeason',  async (ctx, next) => {
    try {
        let year = ctx.request.body.fields.year;
        if (!year) { ctx.response.body = ResponseService.createErrResponse('year not found'); return; }
        let season = ctx.request.body.fields.season;
        if (!season) { ctx.response.body = ResponseService.createErrResponse('season not found'); return; }
        let ret = await ShowService.deleteSeason(year, season);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/getAllByYear',  async (ctx, next) => {
    try {
        let ret = await ShowService.getAllByYear();
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/create', async (ctx, next) => {
    try {
        let file = ctx.request.body.files.img;
        let name = ctx.request.body.fields.name || '';
        let desc = ctx.request.body.fields.desc || '';
        let year = ctx.request.body.fields.year || '';
        let season = ctx.request.body.fields.season || '';
        let rank = ctx.request.body.fields.rank || 0;
        let timestamp = Date.parse(new Date());
        let ret = await ShowService.create(name, desc, year, season, rank, timestamp, file.path);
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
        let show = await ShowService.findOne({id: id});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await ShowService.updateImg(show, timestamp, file.path);
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
        let show = await ShowService.findOne({id: id});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let name = ctx.request.body.fields.name || '';
        let desc = ctx.request.body.fields.desc || '';
        let year = ctx.request.body.fields.year || '';
        let season = ctx.request.body.fields.season || '';
        let ret = await ShowService.update(show, name, desc, year, season);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateDesigner',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let show = await ShowService.findOne({id: id});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let designerId = ctx.request.body.fields.designerId
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let ret = await ShowService.updateDesigner(show, designerId);
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
        let show = await ShowService.findOne({id: id});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await ShowService.addShowLink(show, timestamp, file.path);
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
        let show = await ShowService.findOne({id: id});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let rank = ctx.request.body.fields.rank || 0;
        let files = ctx.request.body.files.imgs;
        let ret = await ShowService.addShowLinks(show, rank, files);
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
        let show = await ShowService.findOne({id: id});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let imgId = ctx.request.body.fields.imgId;
        if (!imgId) { ctx.response.body = ResponseService.createErrResponse('Img Id not found'); return; }
        let showLink = await ShowService.findShowLink(show, imgId);
        if (!showLink) { ctx.response.body = ResponseService.createErrResponse('Img not found'); return; }
        let ret = await ShowService.deleteShowLink(showLink[0]);
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
        let show = await ShowService.findOne({id: id});
        if (!show) { ctx.response.body = ResponseService.createErrResponse('Show not found'); return; }
        let imgIds = ctx.request.body.fields.imgIds;
        if (!imgIds) { ctx.response.body = ResponseService.createErrResponse('Img Id not found'); return; }
        let ret = await ShowService.deleteShowLinks(show, imgIds);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateRanks', async (ctx, next) => {
    try {
        let ranks = ctx.request.body.ranks;
        let ret = await ShowService.updateRanks(ranks);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateShowImgRanks', async (ctx, next) => {
    try {
        let ranks = ctx.request.body.ranks;
        let ret = await ShowService.updateShowLinkRanks(ranks);
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
        let ret = await ShowService.delete({id: id});
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
