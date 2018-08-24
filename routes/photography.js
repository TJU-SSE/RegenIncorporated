const router = require('koa-router')();

const PhotographyService = require('../service/photographyService');
const ResponseService = require('../service/responseService');
const config = require('../utils/config');
const Helper = require('../utils/helper');

// pre URL
router.prefix('/admin/photography');


// ok
router.get('/select/:id', async (ctx, next) => {
  try {
    // let id = ctx.request.body.id;
    let id = ctx.params.id;
    // console.log(ctx.query);
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let photography = await PhotographyService.findOne({ id: id });
    if (!photography) { ctx.response.body = ResponseService.createErrResponse('Photography not found'); return; }
    let ret = await PhotographyService.createPhotographyViewModel(photography);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// ok
router.get('/search/:key', async (ctx, next) => {
  try {
    let key = ctx.params.key;
    if (!key) { ctx.response.body = ResponseService.createErrResponse('key not found'); return; }
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let result = await PhotographyService.search(key, { 'limit': itemSize, 'offset': pageOffset });
    let photographies = result.rows;
    let count = result.count;
    if (!photographies) { ctx.response.body = ResponseService.createErrResponse('Photographies not found'); return; }
    let ret = await PhotographyService.createPhotographiesViewModel(photographies, pageOffset, itemSize, false, count);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// ok
router.get('/selectInsideBanner', async (ctx, next) => {
  try {
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let photographies = await PhotographyService.findAllFilter({
      where: {
        banner: true
      },
      order: [
        ['banner_rank', 'ASC'],
        ['updatedAt', 'DESC']
      ]
    });
    if (!photographies) { ctx.response.body = ResponseService.createErrResponse('Photographies not found'); return; }
    let ret = await PhotographyService.createPhotographiesViewModel(photographies, pageOffset, itemSize);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// ok
router.get('/selectOutsideBanner', async (ctx, next) => {
  try {
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let photographies = await PhotographyService.findAllFilter({
      where: {
        banner: false
      },
      order: [
        ['banner_rank', 'ASC'],
        ['updatedAt', 'DESC']
      ]
    });
    if (!photographies) { ctx.response.body = ResponseService.createErrResponse('Photographies not found'); return; }
    let ret = await PhotographyService.createPhotographiesViewModel(photographies, pageOffset, itemSize);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// ok
router.get('/getAll', async (ctx, next) => {
  try {
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let photographies = await PhotographyService.findAllFilter({ 'limit': itemSize, 'offset': pageOffset });
    if (!photographies) { ctx.response.body = ResponseService.createErrResponse('Photographies not found'); return; }
    let ret = await PhotographyService.createPhotographiesViewModel(photographies, pageOffset, itemSize);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// ok
router.get('/getAllWithoutImgs', async (ctx, next) => {
  try {
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let photographies = await PhotographyService.findAllFilter({ 'limit': itemSize, 'offset': pageOffset });
    if (!photographies) { ctx.response.body = ResponseService.createErrResponse('Photographies not found'); return; }
    let ret = await PhotographyService.createPhotographiesViewModel(photographies, pageOffset, itemSize, true);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

//ok
router.post('/create', async (ctx, next) => {
  try {
    let title = ctx.request.body.title || '';
    let introduction = ctx.request.body.introduction || '';
    let title_cn = ctx.request.body.title_cn || '';
    let introduction_cn = ctx.request.body.introduction_cn || '';
    let cover_url = ctx.request.body.cover_url || '';
    let banner = Helper.containsBool(ctx.request.body.banner) ? ctx.request.body.banner : false;
    let banner_rank = ctx.request.body.banner_rank || 0;
    let tags = ctx.request.body.tags || [];

    if (!Array.isArray(tags)) tags = [tags];
    let ret = await PhotographyService.create(title, introduction, title_cn, introduction_cn, cover_url, banner, banner_rank, tags);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// ok
router.post('/updateImg', async (ctx, next) => {
  try {
    let id = ctx.request.body.id;
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let photography = await PhotographyService.findOne({ id: id });
    if (!photography) { ctx.response.body = ResponseService.createErrResponse('Photography not found'); return; }
    let img_url = ctx.request.body.img_url;
    let timestamp = Date.parse(new Date());
    let ret = await PhotographyService.updateImg(photography, timestamp, img_url);
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
    let photography = await PhotographyService.findOne({ id: id });
    if (!photography) { ctx.response.body = ResponseService.createErrResponse('Photography not found'); return; }
    let title = ctx.request.body.title || '';
    let introduction = ctx.request.body.introduction || '';
    let title_cn = ctx.request.body.title_cn || '';
    let introduction_cn = ctx.request.body.introduction_cn || '';
    let cover_url = ctx.request.body.cover_url || '';
    let banner = Helper.containsBool(ctx.request.body.banner) ? ctx.request.body.banner : false;
    let banner_rank = ctx.request.body.banner_rank || 0;
    let tags = ctx.request.body.tags || [];
    if (!Array.isArray(tags)) tags = [tags];
    let ret = await PhotographyService.update(photography, title, introduction, title_cn, introduction_cn, cover_url, banner, banner_rank, tags);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// OK
router.post('/addPhotographyImg', async (ctx, next) => {
  try {
    let id = ctx.request.body.id;
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let photography = await PhotographyService.findOne({ id: id });
    if (!photography) { ctx.response.body = ResponseService.createErrResponse('Photography not found'); return; }
    let img_url = ctx.request.body.img_url;
    let timestamp = Date.parse(new Date());
    let ret = await PhotographyService.addPhotographyImg(photography, timestamp, img_url);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// OK
router.post('/addPhotographyImgs', async (ctx, next) => {
  try {
    let id = ctx.request.body.id;
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let photography = await PhotographyService.findOne({ id: id });
    if (!photography) { ctx.response.body = ResponseService.createErrResponse('Photography not found'); return; }
    let img_urls = ctx.request.body.img_urls;
    let ret = await PhotographyService.addPhotographyImgs(photography, img_urls)
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// OK
router.post('/deletePhotographyImg', async (ctx, next) => {
  try {
    let id = ctx.request.body.id;
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let photography = await PhotographyService.findOne({ id: id });
    if (!photography) { ctx.response.body = ResponseService.createErrResponse('Photography not found'); return; }
    let imgId = ctx.request.body.img_id;
    if (!imgId) { ctx.response.body = ResponseService.createErrResponse('Img Id not found'); return; }
    let photographyImg = await PhotographyService.findPhotographyImg(photography, imgId)
    if (!photographyImg) { ctx.response.body = ResponseService.createErrResponse('Img not found'); return; }
    let ret = await PhotographyService.deletePhotographyImg(photographyImg[0]);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

// OK
router.post('/deletePhotographyImgs', async (ctx, next) => {
  try {
    let id = ctx.request.body.id;
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let photography = await PhotographyService.findOne({ id: id });
    if (!photography) { ctx.response.body = ResponseService.createErrResponse('Photography not found'); return; }
    let imgIds = ctx.request.body.img_ids;
    if (!imgIds) { ctx.response.body = ResponseService.createErrResponse('Img Id not found'); return; }
    let ret = await PhotographyService.deletePhotographyImgs(photography, imgIds);
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
    let ret = await PhotographyService.delete({ id: id });
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

module.exports = router;
