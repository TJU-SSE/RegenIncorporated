var config = {
  database: 'regen',
  username: 'test',
  password: 'test',
  host: '212.64.17.49',
  port: 3306,
  dialect: 'mysql',
  ACCESS_KEY: 'opKzqbb_E-y_yKjCufAu8KOiBzlhMXH2G-EXuKVj',
  SECRET_KEY: 'b6pyxBh1o8PCNALdlihIZv54wOxqrbxVohrRLQPH',
  bucket: 'infotest',
  filePath: '../img/',
  // download: 'http://oq7eluo6z.bkt.clouddn.com/'
  download: 'http://pc0bksa0g.bkt.clouddn.com/',

  mail_host: 'smtp.sina.com',
  mail_user: 'regeneration_ms@sina.com',
  mail_password: 'regeneration_ms',

  mail_to: ['1061152718@qq.com', 'kenneth0875@gmail.com'],


  ARTIST_PRODUCT_TYPES: {
    UPDATE: 0,
    ACHIEVEMENT: 1
  },

  // FRONTEND_URLS: ['http://localhost:9092', 'http://121.42.169.109:9092']
  // FRONTEND_URL: 'http://regen.org.cn/'
  FRONTEND_URLS: ['http://localhost:9092', 'http://212.64.17.49:9092']
};

module.exports = config;
