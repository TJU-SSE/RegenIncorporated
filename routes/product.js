const router = require('koa-router')();

const ProductService = require('../service/productService');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/product');


// OK
router.get('/select/:id', async (ctx, next) => {
    try {
        // let id = ctx.request.body.id;
        let id = ctx.params.id;
        // console.log(ctx.query);
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let ret = await ProductService.createProductViewModel(product);
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
        let session = ctx.request.body.fields.session || '';
        let releaseTime = ctx.request.body.fields.releaseTime || 0;
        let introduction = ctx.request.body.fields.introduction || '';
        let timestamp = Date.parse(new Date());
        let ret = await ProductService.create(timestamp, file.path, title, session, releaseTime, introduction);
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
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await ProductService.updateImg(product, timestamp, file.path);
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
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let title = ctx.request.body.fields.title || '';
        let session = ctx.request.body.fields.session || '';
        let releaseTime = ctx.request.body.fields.releaseTime || '';
        let introduction = ctx.request.body.fields.introduction || '';
        let ret = await ProductService.update(product, title, session, releaseTime, introduction);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/addProductImg',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await ProductService.addProductImg(product, timestamp, file.path);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/addProductImgs',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let file = ctx.request.body.files.imgs;
        let ret = await ProductService.addProductImgs(product, file);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteProductImg',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let imgId = ctx.request.body.fields.img_id;
        if (!imgId) { ctx.response.body = ResponseService.createErrResponse('Img Id not found'); return; }
        let productImg = await ProductService.findProductImg(product, imgId);
        if (!productImg) { ctx.response.body = ResponseService.createErrResponse('Img not found'); return; }
        let ret = await ProductService.deleteProductImg(productImg[0]);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/deleteProductImgs',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let imgIds = ctx.request.body.fields.img_ids;
        if (!imgIds) { ctx.response.body = ResponseService.createErrResponse('Img Id not found'); return; }
        let ret = await ProductService.deleteProductImgs(product, imgIds);
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
        let ret = await ProductService.delete({id: id});
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
