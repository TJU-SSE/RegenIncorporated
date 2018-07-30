const router = require('koa-router')();

const IndexService = require('../service/indexService');
const ResponseService = require('../service/responseService');

router.post('/admin/createImg', async (ctx, next) => {
  try {
    let file = ctx.request.body.files.img;
    let timestamp = Date.parse(new Date());
    let ret = await IndexService.create(timestamp, file.path);
    ctx.response.body = ResponseService.createJSONResponse(ret);
  } catch(e) {
    ctx.response.body = ResponseService.createErrResponse(e);
  }
});

module.exports = router;
