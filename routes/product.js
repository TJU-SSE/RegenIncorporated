const router = require('koa-router')();

const ProductService = require('../service/productService');
const ResponseService = require('../service/responseService');
const ArtistService = require('../service/artistService');
const config = require('../utils/config')

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
router.get('/search/:key', async (ctx, next) => {
    try {
        let key = ctx.params.key;
        if (!key) { ctx.response.body = ResponseService.createErrResponse('key not found'); return; }
        let pageOffset = ctx.query.pageOffset || 0;
        let itemSize = ctx.query.itemSize || 20;
        itemSize = parseInt(itemSize);
        pageOffset = parseInt(pageOffset) * parseInt(itemSize);
        let result = await ProductService.search(key, {'limit': itemSize, 'offset': pageOffset});
        let products = result.rows;
        let count = result.count;
        if (!products) { ctx.response.body = ResponseService.createErrResponse('Products not found'); return; }
        let ret = await ProductService.createProductsViewModel(products, pageOffset, itemSize, false, count);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.get('/search/:artistId/:type/:key', async (ctx, next) => {
  try {
    let key = ctx.params.key;
    const artistId = ctx.params.artistId;
    const type = parseInt(ctx.params.type, 10) || 0;

    if (!key) { ctx.response.body = ResponseService.createErrResponse('key not found'); return; }
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let result = await ProductService.search(key, {'limit': itemSize, 'offset': pageOffset});
    let products = result.rows;
    let count = result.count;
    if (!products) { ctx.response.body = ResponseService.createErrResponse('Products not found'); return; }
    let ret = await ProductService.createProductsViewModel(products, pageOffset, itemSize, false, count, artistId, type);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// OK
router.get('/selectWithArtists/:id', async (ctx, next) => {
    try {
        let id = ctx.params.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let ret = await ProductService.selectWithArtists(product);
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
        let products = await ProductService.findAllFilter({'limit': itemSize, 'offset': pageOffset});
        if (!products) { ctx.response.body = ResponseService.createErrResponse('Products not found'); return; }
        let ret = await ProductService.createProductsViewModel(products, pageOffset, itemSize);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/getAllWithoutImgs', async (ctx, next) => {
  try {
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let products = await ProductService.findAllFilter({'limit': itemSize, 'offset': pageOffset});
    if (!products) { ctx.response.body = ResponseService.createErrResponse('Products not found'); return; }
    let ret = await ProductService.createProductsViewModel(products, pageOffset, itemSize, true);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

router.get('/getAllWithArtistId/:artistId', async (ctx, next) => {
  try {
    let artistId = ctx.params.artistId;
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let products = await ProductService.findAllFilter({'limit': itemSize, 'offset': pageOffset});
    if (!products) { ctx.response.body = ResponseService.createErrResponse('Products not found'); return; }
    let ret = await ProductService.createProductsViewModelWithRank(products, pageOffset, itemSize, artistId);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

router.get('/getAllWithArtistIdAchievement/:artistId', async (ctx, next) => {
  try {
    let artistId = ctx.params.artistId;
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let products = await ProductService.findAllFilter({'limit': itemSize, 'offset': pageOffset});
    if (!products) { ctx.response.body = ResponseService.createErrResponse('Products not found'); return; }
    let ret = await ProductService.createProductsViewModelWithRank(products, pageOffset, itemSize, artistId,
      config.ARTIST_PRODUCT_TYPES.ACHIEVEMENT);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// OK
router.get('/getArtists/:id', async (ctx, next) => {
    try {
        let id = ctx.params.id;if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let ret = await ProductService.getArtists(product);
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
        let tags = ctx.request.body.fields.tags || [];
        if (!Array.isArray(tags)) tags = [tags];
        let timestamp = Date.parse(new Date());
        let ret = await ProductService.create(timestamp, file.path, title, session, releaseTime, introduction, tags);
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
        let id = ctx.request.body.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let title = ctx.request.body.title || '';
        let session = ctx.request.body.session || '';
        let releaseTime = ctx.request.body.releaseTime || 0;
        let introduction = ctx.request.body.introduction || '';
        let tags = ctx.request.body.tags || [];
        if (!Array.isArray(tags)) tags = [tags];
        let ret = await ProductService.update(product, title, session, releaseTime, introduction, tags);
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
        let id = ctx.request.body.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let product = await ProductService.findOne({id: id});
        if (!product) { ctx.response.body = ResponseService.createErrResponse('Product not found'); return; }
        let imgId = ctx.request.body.img_id;
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
