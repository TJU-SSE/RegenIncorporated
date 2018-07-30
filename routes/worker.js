const router = require('koa-router')();

const WorkerService = require('../service/workerService');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/worker');

// OK
router.get('/selectByName/:name', async (ctx, next) => {
    try {
        let name = ctx.params.name;
        if (!name) { ctx.response.body = ResponseService.createErrResponse('Name not found'); return; }
        let worker = await WorkerService.findOne({name: name});
        if (!worker) { ctx.response.body = ResponseService.createErrResponse('Worker not found'); return; }
        let ret = await WorkerService.createWorkerViewModel(worker);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/selectById/:id', async (ctx, next) => {
    try {
        let id = ctx.params.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Name not found'); return; }
        let worker = await WorkerService.findOne({id: id});
        if (!worker) { ctx.response.body = ResponseService.createErrResponse('Worker not found'); return; }
        let ret = await WorkerService.createWorkerViewModel(worker);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// OK
router.get('/getAll', async (ctx, next) => {
    try {
        let pageOffset = ctx.query.pageOffset || 0;
        let itemSize = ctx.query.itemSize || 20;
        let total = await WorkerService.getTotalSize();
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let workers = await WorkerService.findAllFilter({'limit': itemSize, 'offset': pageOffset, 'order': 'rank'});
        let ret = await WorkerService.createWorkersViewModel(workers, pageOffset, itemSize, total);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/create', async (ctx, next) => {
    try {
        let file = ctx.request.body.files.img;
        let name = ctx.request.body.fields.name || '';
        let email = ctx.request.body.fields.email || '';
        let rank = ctx.request.body.fields.rank || 0;
        let identity = ctx.request.body.fields.identity || '';
        let timestamp = Date.parse(new Date());
        let ret = await WorkerService.create(timestamp, file.path, name, email, rank, identity);
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
        let worker = await WorkerService.findOne({id: id});
        if (!worker) { ctx.response.body = ResponseService.createErrResponse('Worker not found'); return; }
        let name = ctx.request.body.name || '';
        let email = ctx.request.body.email || '';
        let desc = ctx.request.body.desc || '';
        let rank = ctx.request.body.rank || 0;
        let ret = await WorkerService.update(worker, name, email, desc, rank);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateImg',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let worker = await WorkerService.findOne({id: id});
        if (!worker) { ctx.response.body = ResponseService.createErrResponse('Worker not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await WorkerService.updateImg(worker, timestamp, file.path);
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
        let ret = await WorkerService.delete({id: id});
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateRanks', async (ctx, next) => {
    try {
        let ranks = ctx.request.body.ranks;
        let ret = await WorkerService.updateRanks(ranks);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
