const DesignerCampaign = require('../model/designerCampaign');

let pub = {};

pub.findAll = async () => {
    let res = await DesignerCampaign.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    filter['order'] = 'rank';
    let res = await DesignerCampaign.findAll(filter);
    return res;
};

pub.findOne = async (filter) => {
    let res = await DesignerCampaign.findOne({where: filter});
    return res;
};

pub.count = async  (designerId) => {
    return await DesignerCampaign.count({where: {designerId: designerId}});
};

pub.create = async (rank, designerId, campaignId) =>{
    let designer = await DesignerCampaign.create({rank: rank, designerId: designerId, campaignId: campaignId});
    return designer;
};

pub.update = async (designerCampaign, rank) => {
    if(rank) designerCampaign.rank = rank;
    await designerCampaign.save();
};

pub.deleteOne = async (filter) => {
    let designerCampaign = await pub.findOne(filter);
    await designerCampaign.destroy();
};

module.exports = pub;
