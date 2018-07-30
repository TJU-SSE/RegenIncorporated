const DesignerLookbook = require('../model/designerLookbook');

let pub = {};

pub.findAll = async () => {
    let res = await DesignerLookbook.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    filter['order'] = 'rank';
    let res = await DesignerLookbook.findAll(filter);
    return res;
};

pub.findOne = async (filter) => {
    let res = await DesignerLookbook.findOne({where: filter});
    return res;
};

pub.count = async  (designerId) => {
    return await DesignerLookbook.count({where: {designerId: designerId}});
};

pub.create = async (rank, designerId, lookbookId) =>{
    let designer = await DesignerLookbook.create({rank: rank, designerId: designerId, lookbookId: lookbookId});
    return designer;
};

pub.update = async (designerLookbook, rank) => {
    if(rank) designerLookbook.rank = rank;
    await designerLookbook.save();
};

pub.deleteOne = async (filter) => {
    let designerLookbook = await pub.findOne(filter);
    await designerLookbook.destroy();
};

module.exports = pub;
