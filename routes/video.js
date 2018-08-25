const router = require('koa-router')();

const VideoService = require('../service/videoService');
const ResponseService = require('../service/responseService');
const config = require('../utils/config');
const Helper = require('../utils/helper');

// pre URL
router.prefix('/admin/video');


router.get('/select/:id', async (ctx, next) => {
  try {
    // let id = ctx.request.body.id;
    let id = ctx.params.id;
    // console.log(ctx.query);
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let video = await VideoService.findOne({ id: id });
    if (!video) { ctx.response.body = ResponseService.createErrResponse('Video not found'); return; }
    ctx.response.body = ResponseService.createJSONResponse(video);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

router.get('/search/:key', async (ctx, next) => {
  try {
    let key = ctx.params.key;
    if (!key) { ctx.response.body = ResponseService.createErrResponse('key not found'); return; }
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let result = await VideoService.search(key, { 'limit': itemSize, 'offset': pageOffset });
    let videos = result.rows;
    let count = result.count;
    if (!videos) { ctx.response.body = ResponseService.createErrResponse('Videos not found'); return; }
    ctx.response.body = ResponseService.createJSONResponse(videos);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});


router.get('/getAll', async (ctx, next) => {
  try {
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let videos = await VideoService.findAllFilter({ 
      'limit': itemSize, 
      'offset': pageOffset,
      where: {
        banner: false,
        '$not': [
          { 'id': [config.homepage_video_id] }
        ]
      },
      order: [
        ['rank', 'ASC'],
        ['updatedAt', 'DESC']
      ]
    });
    if (!videos) { ctx.response.body = ResponseService.createErrResponse('Videos not found'); return; }
    let ret = await VideoService.createVideosViewModel(videos, pageOffset, itemSize);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

router.get('/getVideoBanner', async (ctx, next) => {
  try {
    let pageOffset = ctx.query.pageOffset || 0;
    let itemSize = ctx.query.itemSize || 20;
    itemSize = parseInt(itemSize);
    pageOffset = parseInt(pageOffset) * parseInt(itemSize);
    let videos = await VideoService.findAllFilter({
      'limit': itemSize,
      'offset': pageOffset,
      where: {
        banner: true
      },
      order: [
        ['rank', 'ASC'],
        ['updatedAt', 'DESC']
      ]
    });
    if (!videos) { ctx.response.body = ResponseService.createErrResponse('Videos not found'); return; }
    let ret = await VideoService.createVideosViewModel(videos, pageOffset, itemSize);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});


router.post('/create', async (ctx, next) => {
  try {

    let title = ctx.request.body.title || '';
    let desc = ctx.request.body.desc || '';
    let intro = ctx.request.body.intro || '';
    let title_cn = ctx.request.body.title_cn || '';
    let desc_cn = ctx.request.body.desc_cn || '';
    let intro_cn = ctx.request.body.intro_cn || '';
    let cover = ctx.request.body.cover || '';
    let video = ctx.request.body.video || '';
    let rank = ctx.request.body.rank || '';
    let banner = Helper.containsBool(ctx.request.body.banner) ? ctx.request.body.banner : false;

    let ret = await VideoService.create(title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});


router.post('/update', async (ctx, next) => {
  try {
    let id = ctx.request.body.id;
    console.log("OK");
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let v = await VideoService.findOne({ id: id });
    if (!v) { ctx.response.body = ResponseService.createErrResponse('Video not found'); return; }
    let title = ctx.request.body.title || '';
    let desc = ctx.request.body.desc || '';
    let intro = ctx.request.body.intro || '';
    let title_cn = ctx.request.body.title_cn || '';
    let desc_cn = ctx.request.body.desc_cn || '';
    let intro_cn = ctx.request.body.intro_cn || '';
    let cover = ctx.request.body.cover || '';
    let video = ctx.request.body.video || '';
    let rank = ctx.request.body.rank || '';
    let banner = Helper.containsBool(ctx.request.body.banner) ? ctx.request.body.banner : false;
    let ret = await VideoService.update(v, title, desc, intro, title_cn, desc_cn, intro_cn, cover, video, rank, banner);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

router.post('/delete', async (ctx, next) => {
  try {
    let id = ctx.request.body.id;
    if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
    let ret = await VideoService.delete({ id: id });
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch (e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

module.exports = router;
