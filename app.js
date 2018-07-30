const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const koaBody = require('koa-body');
const cors = require('koa2-cors');

const templating = require('./middleware/templating');

const index = require('./routes/index');
const users = require('./routes/users');
const lookbook = require('./routes/lookbook');
const campaign = require('./routes/campaign');
const cooperation = require('./routes/cooperation');
const branding = require('./routes/branding');
const designer = require('./routes/designer');
const news = require('./routes/news');
const product = require('./routes/product');
const artist = require('./routes/artist');
const indexImg = require('./routes/indexImg');
const tag = require('./routes/tag');
const worker = require('./routes/worker');
const contact = require('./routes/contact');
const config_api = require('./routes/config');
const show = require('./routes/show');
const redis = require('./routes/redis');
const message = require('./routes/message');

const checkAuthority = require('./middleware/authority');

const config = require('./utils/config')

const initDB = require('./orm/initDB');
initDB();

// error handler
onerror(app);

const isProduction = process.env.NODE_ENV === 'production';

// middlewares
app.use(koaBody({multipart: true}));
// app.use(bodyparser);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

// templating
app.use(views(__dirname + '/views', {
  options: {
    nunjucksEnv: templating('views', {
      noCache: !isProduction,
      watch: !isProduction
    })
  },
  map: {html: 'nunjucks'}
}));


// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// cors
app.use(cors({
  origin: config.FRONTEND_URL,
  // origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous']
}));

// authority
app.use(checkAuthority());


// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(lookbook.routes(), lookbook.allowedMethods());
app.use(campaign.routes(), campaign.allowedMethods());
app.use(cooperation.routes(), cooperation.allowedMethods());
app.use(branding.routes(), branding.allowedMethods());
app.use(designer.routes(), designer.allowedMethods());
app.use(news.routes(), news.allowedMethods());
app.use(product.routes(), product.allowedMethods());
app.use(artist.routes(), artist.allowedMethods());
app.use(indexImg.routes(), indexImg.allowedMethods());
app.use(tag.routes(), tag.allowedMethods());
app.use(worker.routes(), worker.allowedMethods());
app.use(show.routes(), show.allowedMethods());
app.use(contact.routes(), contact.allowedMethods());
app.use(config_api.routes(), config_api.allowedMethods());
app.use(message.routes(), message.allowedMethods());
// app.use(redis.routes(), redis.allowedMethods());


module.exports = app;
