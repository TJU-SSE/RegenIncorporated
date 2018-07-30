const DesignerCooperation = require('../model/designerCooperation');

let pub = {};

pub.findAll = async () => {
    let res = await DesignerCooperation.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    filter['order'] = 'rank';
    let res = await DesignerCooperation.findAll(filter);
    return res;
};

pub.findOne = async (filter) => {
    let res = await DesignerCooperation.findOne({where: filter});
    return res;
};

pub.count = async  (designerId) => {
    return await DesignerCooperation.count({where: {designerId: designerId}});
};

pub.create = async (rank, designerId, cooperationId) =>{
    let designer = await DesignerCooperation.create({rank: rank, designerId: designerId, cooperationId: cooperationId});
    return designer;
};

pub.update = async (designerCooperation, rank) => {
    if(rank) designerCooperation.rank = rank;
    await designerCooperation.save();
};

pub.deleteOne = async (filter) => {
    let designerCooperation = await pub.findOne(filter);
    await designerCooperation.destroy();
};

module.exports = pub;
