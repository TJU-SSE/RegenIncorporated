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
const Photography = require('./model/photography');
const PhotographyImg = require('./model/photographyImg');
const PhotographyTag = require('./model/photographyTag');
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

    Photography.sync().then( function () {
        console.log("create photography success");
    })

    PhotographyImg.sync().then(function () {
        console.log("create photographyImg success");
    })

    PhotographyTag.sync().then(function () {
        console.log("create photographyTag success");
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

    //---------------- news -------------------------------------------
    News.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg' });
    News.hasMany(NewsTag, { as: 'NewsTags' });
    News.hasMany(NewsTag, { as: 'NewsTags' });
    // 此条为当需要在首页显示时需要的内容，经查证前端已不再使用这种首页
    IndexImg.belongsTo(News, { foreignKey: 'news_id', as: 'news' }); 

    //---------------- product -------------------------------------------
    ProductImg.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Product.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Product.hasMany(ProductImg, {as: 'ProductImgs'});
    Product.hasMany(ArtistProduct, {as: 'ArtistProducts'});
    Product.hasMany(Achievement, { as: 'Achievements' });
    Product.hasMany(ProductTag, { as: 'ProductTags' });
    // 此为首页显示product时的rank
    IndexProduct.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    //---------------- artist -------------------------------------------
    Artist.hasMany(ArtistProduct, {as: 'ArtistProducts'});
    Artist.hasMany(Achievement, {as: 'Achievements'});
    Artist.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});

    //---------------- tags -------------------------------------------
    Tag.hasMany(NewsTag, {as: 'NewsTags'});
    Tag.hasMany(ProductTag, {as: 'ProductTags'});
    Tag.hasMany(PhotographyTag, { as: 'PhotographyTags'});

    //---------------- contact -------------------------------------------
    Contact.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg' });

    //---------------- photography -------------------------------------------
    PhotographyImg.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg' });
    Photography.hasMany(PhotographyImg, { as: 'PhotographyImgs' });
    Photography.hasMany(PhotographyTag, { as: 'PhotographyTags'});

    //---------------- others -------------------------------------------
    Worker.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});


    await syncAll();
};


module.exports = init;
