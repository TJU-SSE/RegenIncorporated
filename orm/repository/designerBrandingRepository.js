const DesignerBranding = require('../model/designerBranding');

let pub = {};

pub.findAll = async () => {
    let res = await DesignerBranding.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    filter['order'] = 'rank';
    let res = await DesignerBranding.findAll(filter);
    return res;
};

pub.findOne = async (filter) => {
    let res = await DesignerBranding.findOne({where: filter});
    return res;
};

pub.count = async  (designerId) => {
    return await DesignerBranding.count({where: {designerId: designerId}});
};

pub.create = async (rank, designerId, brandingId) =>{
    let designer = await DesignerBranding.create({rank: rank, designerId: designerId, brandingId: brandingId});
    return designer;
};

pub.update = async (designerBranding, rank) => {
    if(rank) designerBranding.rank = rank;
    await designerBranding.save();
};

pub.deleteOne = async (filter) => {
    let designerBranding = await pub.findOne(filter);
    await designerBranding.destroy();
};

module.exports = pub;
