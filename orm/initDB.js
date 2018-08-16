const Img = require('./model/img');
const News = require('./model/news');
const Session = require('./model/session');
const Test = require('./model/test');
const User = require('./model/user');
const Product = require('./model/product');
const ProductImg = require('./model/productImg');
const Artist = require('./model/artist');
const ArtistProduct = require('./model/atristProduct');
const Achievement = require('./model/achievement');
const IndexImg = require('./model/indexImg');
const IndexProduct = require('./model/indexProduct');
const NewsTag = require('./model/newsTag');
const ProductTag = require('./model/productTag');
const Tag = require('./model/tag');
const Worker = require('./model/worker');
const Contact = require('./model/contact');
const Message = require('./model/message');
const Video = require('./model/video');
const Config = require('./model/config');

let syncAll = async () => {
    Img.sync().then(function () {
        console.log("create img success");
    });

    News.sync().then(function () {
        console.log("create news success");
    });

    Session.sync().then(function () {
        console.log("create session success");
    });

    Test.sync().then(function () {
        console.log("create test success");
    });

    User.sync().then(function () {
        console.log("create user success");
    });

    ArtistProduct.sync().then(function () {
        console.log("create artist_product success");
    });

    Achievement.sync().then(function () {
        console.log("create achievement success");
    });

    ProductImg.sync().then(function () {
        console.log("create product_img success");
    });

    Product.sync().then(function () {
        console.log("create product success");
    });

    Artist.sync().then(function () {
        console.log("create artist success");
    });

    IndexImg.sync().then(function () {
        console.log("create index_img success");
    });

    IndexProduct.sync().then(function () {
        console.log("create index_product success");
    });

    Tag.sync().then(function () {
        console.log("create tag success");
    });

    NewsTag.sync().then(function () {
        console.log("create news_tag success");
    });

    ProductTag.sync().then(function () {
        console.log("create product_tag success");
    });

    Worker.sync().then(function () {
        console.log("create worker success");
    });

    Message.sync().then( function () {
        console.log("create message success");
    })

    Video.sync().then( function () {
        console.log("create video success");
    })

    Config.sync().then(function () {
        console.log("create config success");
    });

    Contact.sync().then(async () => {
        let contact = await Contact.findOne({id:1});
        if (!contact) {
            Contact.create({id: 1});
        }
        console.log("create contact success");
    });
};

let init = async () => {

    // Img.hasOne(News, { foreignKey: 'cover_img' });
    // Img.hasOne(News, { foreignKey: 'cover_img'});
    News.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    ProductImg.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Product.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Product.hasMany(ProductImg, {as: 'ProductImgs'});
    Product.hasMany(ArtistProduct, {as: 'ArtistProducts'});
    Artist.hasMany(ArtistProduct, {as: 'ArtistProducts'});
    Product.hasMany(Achievement, {as: 'Achievements'});
    Artist.hasMany(Achievement, {as: 'Achievements'});
    Artist.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    IndexImg.belongsTo(News, { foreignKey: 'news_id', as: 'news'});
    IndexProduct.belongsTo(Product, { foreignKey: 'product_id', as: 'product'});
    News.hasMany(NewsTag, {as: 'NewsTags'});
    Tag.hasMany(NewsTag, {as: 'NewsTags'});
    Product.hasMany(ProductTag, {as: 'ProductTags'});
    Tag.hasMany(ProductTag, {as: 'ProductTags'});
    Worker.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Contact.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    await syncAll();
};


module.exports = init;
