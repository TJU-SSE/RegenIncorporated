const Img = require('./model/img');
const Portfolio = require('./model/portfolio');
const PortfolioImg = require('./model/portfolioImg');
const Lookbook = require('./model/lookbook');
const Campaign = require('./model/campaign');
const Branding = require('./model/branding');
const Cooperation = require('./model/cooperation');
const Designer = require('./model/designer');
const DesignerLookbook = require('./model/designerLookbook');
const DesignerCampaign = require('./model/designerCampaign');
const DesignerBranding = require('./model/designerBranding');
const DesignerCooperation = require('./model/designerCooperation');
const Show = require('./model/show');
const Season = require('./model/season');
const ShowLink = require('./model/showLink');


const News = require('./model/news');
const Session = require('./model/session');
const Test = require('./model/test');
const User = require('./model/user');
const Product = require('./model/product');
const ProductImg = require('./model/productImg');
const Artist = require('./model/artist');
const ArtistProduct = require('./model/atristProduct');
const IndexImg = require('./model/indexImg');
const NewsTag = require('./model/newsTag');
const Tag = require('./model/tag');
const Worker = require('./model/worker');
const Contact = require('./model/contact');
const Config = require('./model/config');

const Message = require('./model/message')

let syncAll = async () => {

    Img.sync().then(function () {
        console.log("create Img success");
    });

    Portfolio.sync().then(function () {
        console.log("create Portfolio success");
    });

    PortfolioImg.sync().then(function () {
        console.log("create PortfolioImg success");
    });

    Lookbook.sync().then(function () {
        console.log("create Lookbook success");
    });

    Campaign.sync().then(function () {
        console.log("create Campaign success");
    });

    Branding.sync().then(function () {
        console.log("create Branding success");
    });

    Cooperation.sync().then(function () {
        console.log("create Cooperation success");
    });

    Designer.sync().then(function () {
        console.log("create Designer success");
    });

    DesignerLookbook.sync().then(function () {
        console.log("create DesignerLookbook success");
    });

    DesignerCampaign.sync().then(function () {
        console.log("create DesignerCampaign success");
    });

    DesignerBranding.sync().then(function () {
        console.log("create DesignerBranding success");
    });

    DesignerCooperation.sync().then(function () {
        console.log("create DesignerCooperation success");
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

    Tag.sync().then(function () {
        console.log("create tag success");
    });

    NewsTag.sync().then(function () {
        console.log("create news_tag success");
    });

    Worker.sync().then(function () {
        console.log("create worker success");
    });

    Contact.sync().then(async () => {
        let contact = await Contact.findOne({id:1});
        if (!contact) {
            Contact.create({id: 1});
        }
        console.log("create worker success");
    });

    Config.sync().then(function () {
        console.log("create config success");
    });

    Show.sync().then(async () => {
        console.log("create show success");
    });

    Season.sync().then(async () => {
        console.log("create season success");
    });

    ShowLink.sync().then(async () => {
        console.log("create show_link success");
    });

    Message.sync().then(async () => {
        console.log("create message success");
    })
};

let init = async () => {

    // Img.hasOne(News, { foreignKey: 'cover_img' });
    // Img.hasOne(News, { foreignKey: 'cover_img'});

    Portfolio.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    PortfolioImg.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Portfolio.hasMany(PortfolioImg, {as: 'PortfolioImgs'});
    Lookbook.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'Portfolio'});
    Campaign.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'Portfolio'});
    Cooperation.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'Portfolio'});
    Branding.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'Portfolio'});
    Designer.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Designer.belongsTo(Img, { foreignKey: 'title_img', as: 'titleImg'});
    Lookbook.hasMany(DesignerLookbook, { as: 'DesignerLookbooks'});
    Designer.hasMany(DesignerLookbook, { as: 'DesignerLookbooks'});
    Campaign.hasMany(DesignerCampaign, { as: 'DesignerCampaigns'});
    Designer.hasMany(DesignerCampaign, { as: 'DesignerCampaigns'});
    Branding.hasMany(DesignerBranding, { as: 'DesignerBrandings'});
    Designer.hasMany(DesignerBranding, { as: 'DesignerBrandings'});
    Cooperation.hasMany(DesignerCooperation, { as: 'DesignerCooperations'});
    Designer.hasMany(DesignerCooperation, { as: 'DesignerCooperations'});
    ShowLink.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Show.belongsTo(Designer, { foreignKey: 'designerId', as: 'designer'});
    Show.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Show.hasMany(ShowLink, {as: 'ShowLinks'});

    News.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    ProductImg.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Product.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Product.hasMany(ProductImg, {as: 'ProductImgs'});
    Product.hasMany(ArtistProduct, {as: 'ArtistProducts'});
    Artist.hasMany(ArtistProduct, {as: 'ArtistProducts'});
    Artist.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    IndexImg.belongsTo(News, { foreignKey: 'news_id', as: 'news'});
    News.hasMany(NewsTag, {as: 'NewsTags'});
    Tag.hasMany(NewsTag, {as: 'NewsTags'});
    Worker.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Contact.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    await syncAll();
};


module.exports = init;
