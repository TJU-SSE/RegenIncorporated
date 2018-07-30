const router = require('koa-router')();

const DesignerService = require('../service/designerService');
const LookbookService = require('../service/lookbookService');
const CampaignService = require('../service/campaignService');
const BrandingService = require('../service/brandingService');
const CooperationService = require('../service/cooperationService');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/designer');


// OK
router.get('/getAllDesignerNames', async (ctx, next) => {
    try {
        let ret = await DesignerService.getAllDesignerNames();
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// OK
router.get('/getAllDesignerNamesByFirst', async (ctx, next) => {
    try {
        let ret = await DesignerService.getAllDesignerNamesByFirst();
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
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let ret = await DesignerService.getAll(pageOffset, itemSize);
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
        let designer = await DesignerService.findOne({name: name});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let ret = await DesignerService.createDesignerViewModel(designer);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/search/:name', async (ctx, next) => {
    try {
        let name = ctx.params.name;
        if (!name) { ctx.response.body = ResponseService.createErrResponse('Name not found'); return; }
        let designers = await DesignerService.findAllFilter({where: {name: {'$like': '%'+name+'%'}}, 'order': 'rank'});
        let ret = await DesignerService.createDesignersViewModelWithoutPage(designers);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/selectByIdentity/:identity', async (ctx, next) => {
    try {
        let identity = ctx.params.identity;
        if (!identity) { ctx.response.body = ResponseService.createErrResponse('Identity not found'); return; }
        let pageOffset = ctx.query.pageOffset || 0;
        let itemSize = ctx.query.itemSize || 20;
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let designers = await DesignerService.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {identity: identity}});
        let ret = await DesignerService.createDesignersViewModel(designers, pageOffset, itemSize);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/select/:id', async (ctx, next) => {
    try {
        let id = ctx.params.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let designer = await DesignerService.findOne({id: id});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let ret = await DesignerService.createDesignerViewModel(designer);
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
        let identity = ctx.request.body.fields.identity || '';
        let social = ctx.request.body.fields.social || '';
        let address = ctx.request.body.fields.address || '';
        let extraBiography = ctx.request.body.fields.extraBiography || '';
        let biography = ctx.request.body.fields.biography || '';
        let rank = ctx.request.body.fields.rank || 0;
        let first = ctx.request.body.fields.first || '';
        let timestamp = Date.parse(new Date());
        let ret = await DesignerService.create(timestamp, file.path, name, identity, social, address, extraBiography, biography, rank, first);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/update', async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let designer = await DesignerService.findOne({id: id});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let name = ctx.request.body.fields.name || '';
        let identity = ctx.request.body.fields.identity || '';
        let social = ctx.request.body.fields.social || '';
        let address = ctx.request.body.fields.address || '';
        let extraBiography = ctx.request.body.fields.extraBiography || '';
        let biography = ctx.request.body.fields.biography || '';
        let first = ctx.request.body.fields.first || '';
        let ret = await DesignerService.update(designer, name, identity, social, address, extraBiography, biography, first);
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
        let designer = await DesignerService.findOne({id: id});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await DesignerService.updateImg(designer, timestamp, file.path);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.post('/updateTitleImg', async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let designer = await DesignerService.findOne({id: id});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await DesignerService.updateTitleImg(designer, timestamp, file.path);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateRanks', async (ctx, next) => {
    try {
        let ranks = ctx.request.body.ranks;
        let ret = await DesignerService.updateRanks(ranks);
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
        let ret = await DesignerService.delete({id: id});
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// ****************************  Lookbook  ****************************

// OK
router.post('/addLookbook',  async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let lookbookId = ctx.request.body.lookbookId;
        if (!lookbookId) { ctx.response.body = ResponseService.createErrResponse('LookbookId not found'); return; }
        let lookbook = await LookbookService.findOne({id: lookbookId});
        if (!lookbook) { ctx.response.body = ResponseService.createErrResponse('Lookbook not found'); return; }
        let rank = ctx.request.body.rank || 0;
        let ret = await DesignerService.addLookbook(rank, designer, lookbook);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/getAllLookbooks/:id',  async (ctx, next) => {
    try {
        let designerId = ctx.params.id;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let pageOffset = ctx.query.pageOffset || 0;
        let itemSize = ctx.query.itemSize || 20;
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let ret = await DesignerService.getAllLookbooks(designer, pageOffset, itemSize);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteLookbook',  async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let lookbookId = ctx.request.body.lookbookId;
        if (!lookbookId) { ctx.response.body = ResponseService.createErrResponse('LookbookId not found'); return; }
        let lookbook = await LookbookService.findOne({id: lookbookId});
        if (!lookbook) { ctx.response.body = ResponseService.createErrResponse('Lookbook not found'); return; }
        let ret = await DesignerService.deleteLookbook(designer, lookbook);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// OK
router.post('/updateLookbookRanks', async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let ranks = ctx.request.body.ranks;
        let ret = await DesignerService.updateLookbookRanks(designer, ranks);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// ****************************  Campaign  ****************************

// OK
router.post('/addCampaign',  async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let campaignId = ctx.request.body.campaignId;
        if (!campaignId) { ctx.response.body = ResponseService.createErrResponse('CampaignId not found'); return; }
        let campaign = await CampaignService.findOne({id: campaignId});
        if (!campaign) { ctx.response.body = ResponseService.createErrResponse('Campaign not found'); return; }
        let rank = ctx.request.body.rank || 0;
        let ret = await DesignerService.addCampaign(rank, designer, campaign);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/getAllCampaigns/:id',  async (ctx, next) => {
    try {
        let designerId = ctx.params.id;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let pageOffset = ctx.query.pageOffset || 0;
        let itemSize = ctx.query.itemSize || 20;
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let ret = await DesignerService.getAllCampaigns(designer, pageOffset, itemSize);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteCampaign',  async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let campaignId = ctx.request.body.campaignId;
        if (!campaignId) { ctx.response.body = ResponseService.createErrResponse('CampaignId not found'); return; }
        let campaign = await CampaignService.findOne({id: campaignId});
        if (!campaign) { ctx.response.body = ResponseService.createErrResponse('Campaign not found'); return; }
        let ret = await DesignerService.deleteCampaign(designer, campaign);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// OK
router.post('/updateCampaignRanks', async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let ranks = ctx.request.body.ranks;
        let ret = await DesignerService.updateCampaignRanks(designer, ranks);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// ****************************  Branding  ****************************

// OK
router.post('/addBranding',  async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let brandingId = ctx.request.body.brandingId;
        if (!brandingId) { ctx.response.body = ResponseService.createErrResponse('BrandingId not found'); return; }
        let branding = await BrandingService.findOne({id: brandingId});
        if (!branding) { ctx.response.body = ResponseService.createErrResponse('Branding not found'); return; }
        let rank = ctx.request.body.rank || 0;
        let ret = await DesignerService.addBranding(rank, designer, branding);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/getAllBrandings/:id',  async (ctx, next) => {
    try {
        let designerId = ctx.params.id;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let pageOffset = ctx.query.pageOffset || 0;
        let itemSize = ctx.query.itemSize || 20;
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let ret = await DesignerService.getAllBrandings(designer, pageOffset, itemSize);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteBranding',  async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let brandingId = ctx.request.body.brandingId;
        if (!brandingId) { ctx.response.body = ResponseService.createErrResponse('BrandingId not found'); return; }
        let branding = await BrandingService.findOne({id: brandingId});
        if (!branding) { ctx.response.body = ResponseService.createErrResponse('Branding not found'); return; }
        let ret = await DesignerService.deleteBranding(designer, branding);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// OK
router.post('/updateBrandingRanks', async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let ranks = ctx.request.body.ranks;
        let ret = await DesignerService.updateBrandingRanks(designer, ranks);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// ****************************  Cooperation  ****************************

// OK
router.post('/addCooperation',  async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let cooperationId = ctx.request.body.cooperationId;
        if (!cooperationId) { ctx.response.body = ResponseService.createErrResponse('CooperationId not found'); return; }
        let cooperation = await CooperationService.findOne({id: cooperationId});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let rank = ctx.request.body.rank || 0;
        let ret = await DesignerService.addCooperation(rank, designer, cooperation);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/getAllCooperations/:id',  async (ctx, next) => {
    try {
        let designerId = ctx.params.id;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let pageOffset = ctx.query.pageOffset || 0;
        let itemSize = ctx.query.itemSize || 20;
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let ret = await DesignerService.getAllCooperations(designer, pageOffset, itemSize);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteCooperation',  async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let cooperationId = ctx.request.body.cooperationId;
        if (!cooperationId) { ctx.response.body = ResponseService.createErrResponse('CooperationId not found'); return; }
        let cooperation = await CooperationService.findOne({id: cooperationId});
        if (!cooperation) { ctx.response.body = ResponseService.createErrResponse('Cooperation not found'); return; }
        let ret = await DesignerService.deleteCooperation(designer, cooperation);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


// OK
router.post('/updateCooperationRanks', async (ctx, next) => {
    try {
        let designerId = ctx.request.body.designerId;
        if (!designerId) { ctx.response.body = ResponseService.createErrResponse('DesignerId not found'); return; }
        let designer = await DesignerService.findOne({id: designerId});
        if (!designer) { ctx.response.body = ResponseService.createErrResponse('Designer not found'); return; }
        let ranks = ctx.request.body.ranks;
        let ret = await DesignerService.updateCooperationRanks(designer, ranks);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});


module.exports = router;
