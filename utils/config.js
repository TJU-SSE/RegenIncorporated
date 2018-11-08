var config = {
  database: 'regenInc',
  username: 'root',
  password: 'Aa123456!',
  host: '101.132.77.182',
  port: 3306,
  dialect: 'mysql',
  ACCESS_KEY: 'opKzqbb_E-y_yKjCufAu8KOiBzlhMXH2G-EXuKVj',
  SECRET_KEY: 'b6pyxBh1o8PCNALdlihIZv54wOxqrbxVohrRLQPH',
  bucket: 'inforegen',
  filePath: '../img/',
  // download: 'http://oq7eluo6z.bkt.clouddn.com/'
  // download: 'http://pc0bksa0g.bkt.clouddn.com/',
  download: 'http://cdn.regeneration.cn/',

  mail_host: 'smtp.sina.com',
  mail_user: 'regeneration_ms@sina.com',
  mail_password: 'regeneration_ms',

  mail_to: ['1061152718@qq.com', 'info@regen.org.cn'],
  homepage_video_id : 1,


  ARTIST_PRODUCT_TYPES: {
    UPDATE: 0,
    ACHIEVEMENT: 1
  },

  // FRONTEND_URLS: ['http://localhost:9092', 'http://121.42.169.109:9092']
  // FRONTEND_URL: 'http://regen.org.cn/'
  FRONTEND_URLS: ['http://localhost:9092', 'http://212.64.17.49:9092', 'http://localhost', 'http://192.168.31.196']
};

module.exports = config;
