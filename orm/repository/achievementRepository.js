const Achievement = require('../model/achievement');

let pub = {};

pub.findAll = async () => {
    let res = await Achievement.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Achievement.findAll({where: filter});
    return res;
};

pub.findOne = async (filter) => {
    let res = await Achievement.findOne({where: filter});
    return res;
};

pub.create = async (artist, product, rank) =>{
    let achievement = await Achievement.create({ rank: rank });
    let achievements1 = await artist.getAchievements();
    achievements1.push(achievement);
    artist.setAchievements(achievements1);
    let achievements2 = await product.getAchievements();
    achievements2.push(achievement);
    product.setAchievements(achievements2);
    return achievement;
};

pub.update = async (achievement, rank) => {
    if (rank) achievement.rank = rank;
    await achievement.save();
};

pub.deleteOne = async (filter) => {
    let achievement = await pub.findOne(filter);
    if (achievement) {
        await achievement.destroy();
    }
};

pub.delete = async (achievement) => {
    await achievement.destroy();
};

pub.getAchievements = async (artist, pageOffset, itemSize) => {
    let achievements = await Achievement.findAll({'limit': itemSize, 'offset': pageOffset, 'order': 'rank', where:{artistId: artist.get('id')}});
    let count = await Achievement.count({where:{artistId: artist.get('id')}});
    return [achievements, count];
};

module.exports = pub;
