const LookbookService = require('./lookbookService');
const CampaignService = require('./campaignService');
const BrandingService = require('./brandingService');
const CooperationService = require('./cooperationService');
const DesignerRepository = require('../orm/repository/designerRepository');
const DesignerLookbookRepository = require('../orm/repository/designerLookbookRepository');
const DesignerCampaignRepository = require('../orm/repository/designerCampaignRepository');
const DesignerBrandingRepository = require('../orm/repository/designerBrandingRepository');
const DesignerCooperationRepository = require('../orm/repository/designerCooperationRepository');
const DesignerViewModel = require('../view_model/designer');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.findOne = async (filter) => {
    return await DesignerRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await DesignerRepository.findAllFilter(filter);
};

pub.getAll = async (pageOffset, itemSize) => {
    try{
        let total = await DesignerRepository.count();
        let designers = await DesignerRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, 'order': 'rank'});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for (let x in designers) {
            let designer = designers[x];
            let id = designer.get('id');
            let name = designer.get('name');
            let rank = designer.get('rank');
            let first = designer.get('first');
            let img = await designer.getCoverImg();
            let img_id = img ? img.get('id') : null;
            let img_url = img ? img.get('url') : null;
            let title_img = await designer.getTitleImg();
            let title_img_id = title_img ? title_img.get('id') : null;
            let title_img_url = title_img ? title_img.get('url') : null;
            list.push({id:id, name:name, rank:rank, first:first, img_id:img_id, img_url:img_url, title_img_id: title_img_id, title_img_url:title_img_url});
        }
        ret['designers'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.getAllDesignerNames = async () => {
    try{
        let designers = await DesignerRepository.findAllNames();
        let ret = [];
        for (let x in designers) {
            let designer = designers[x];
            let id = designer.get('id');
            let name = designer.get('name');
            let first = designer.get('first');
            ret.push({id:id, name:name});
        }
        return ret;
    } catch (e) {
        return e;
    }
};

pub.getAllDesignerNamesByFirst = async () => {
    try{
        let designers = await DesignerRepository.findAllOrderByFirst();
        let ret = {};
        let list = [];
        let last = 'a';
        for (let x in designers) {
            let designer = designers[x];
            let id = designer.get('id');
            let name = designer.get('name');
            let first = designer.get('first');
            if (first != last) {
                ret[last] = list;
                list = [];
                last = first;
            }
            list.push({id:id, name:name})
        }
        ret[last] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.create = async (key, localFile, name, identity, social, address, extraBiography, biography, rank, first) => {
    try {
        let designer = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            designer = await DesignerRepository.create(name, identity, social, address, extraBiography, biography, rank, first, img);
        });
        let id = designer.get('id');
        return {id:id};
    } catch (e) {
        return e;
    }
};

pub.updateImg = async (designer, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await DesignerRepository.updateImg(designer, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.updateTitleImg = async (designer, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await DesignerRepository.updateTitleImg(designer, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.update = async (designer, name, identity, social, address, extraBiography, biography, first) => {
    try {
        await DesignerRepository.update(designer, name, identity, social, address, extraBiography, biography, first);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await DesignerRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createDesignerViewModel = async (designer) => {
    try {
        let id = designer.get('id');
        let name = designer.get('name');
        let identity = designer.get('identity');
        let social = designer.get('social');
        let address = designer.get('address');
        let extraBiography = designer.get('extraBiography');
        let biography = designer.get('biography');
        let rank = designer.get('rank');
        let viewcount = designer.get('viewcount');
        let first = designer.get('first');
        let img = await designer.getCoverImg();
        let img_id = img ? img.get('id') : null;
        let img_url = img ? img.get('url') : null;
        let title_img = await designer.getTitleImg();
        let title_img_id = title_img ? title_img.get('id') : null;
        let title_img_url = title_img ? title_img.get('url') : null;
        return DesignerViewModel.createDesigner(id, name, identity, social, address, extraBiography, biography, rank, viewcount, first, img_id, img_url, title_img_id, title_img_url);
    } catch (e) {
        return e;
    }
};

pub.createDesignersViewModel = async (designers, pageOffset, itemSize) => {
    try {
        let total = DesignerRepository.count();
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designers) {
            let designer = designers[x];
            let id = designer.get('id');
            let name = designer.get('name');
            let identity = designer.get('identity');
            let rank = designer.get('rank');
            let first = designer.get('first');
            let img = await designer.getCoverImg();
            let img_id = img ? img.get('id') : null;
            let img_url = img ? img.get('url') : null;
            let title_img = await designer.getTitleImg();
            let title_img_id = title_img ? title_img.get('id') : null;
            let title_img_url = title_img ? title_img.get('url') : null;
            list.push(DesignerViewModel.createDesignerBrief(id, name, identity, rank, first, img_id, img_url, title_img_id, title_img_url))
        }
        ret['designers'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.createDesignersViewModelWithoutPage = async (designers) => {
    try {
        let ret = {};
        let list = [];
        for(let x in designers) {
            let designer = designers[x];
            let id = designer.get('id');
            let name = designer.get('name');
            let identity = designer.get('identity');
            let rank = designer.get('rank');
            let first = designer.get('first');
            let img = await designer.getCoverImg();
            let img_id = img ? img.get('id') : null;
            let img_url = img ? img.get('url') : null;
            let title_img = await designer.getTitleImg();
            let title_img_id = title_img ? title_img.get('id') : null;
            let title_img_url = title_img ? title_img.get('url') : null;
            list.push(DesignerViewModel.createDesignerBrief(id, name, identity, rank, first, img_id, img_url, title_img_id, title_img_url))
        }
        ret['designers'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateRanks = async (ranks) => {
    try {
        let designers = await DesignerRepository.findAll();
        for (let x in ranks) {
            let id = ranks[x].id;
            let rank = ranks[x].rank;
            for (let y in designers) {
                let designer = designers[y];
                if (designer.get('id') == id) {
                    console.log(designer.get('id')+'-'+id);
                    await DesignerRepository.updateRank(designer, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

// ****************************  Lookbook  ****************************

pub.addLookbook = async (rank, designer, lookbook) => {
    try {
        let designerId = designer.get('id');
        let lookbookId = lookbook.get('id');
        await DesignerLookbookRepository.create(rank, designerId, lookbookId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteLookbook = async (designer, lookbook) => {
    try {
        let designerId = designer.get('id');
        let lookbookId = lookbook.get('id');
        await DesignerLookbookRepository.deleteOne({designerId: designerId, lookbookId: lookbookId});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAllLookbooks = async (designer, pageOffset, itemSize) => {
    try {
        let id = designer.get('id');
        let total = await DesignerLookbookRepository.count(id);
        let designerLookbooks = await DesignerLookbookRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {designerId: id}});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designerLookbooks) {
            let lookbookId = await designerLookbooks[x].get('lookbookId');
            let lookbook = await LookbookService.findOne({id:lookbookId});
            let lookbookViewModel = await LookbookService.createLookbookViewModel(lookbook);
            lookbookViewModel['rank'] = designerLookbooks[x].get('rank');
            list.push(lookbookViewModel);
        }
        ret['lookbooks'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateLookbookRanks = async (designer, ranks) => {
    try {
        let designerId = designer.get('id');
        let designerLookbooks = await DesignerLookbookRepository.findAllFilter({where: {designerId: designerId}});
        for (let x in ranks) {
            let id = ranks[x].lookbookId;
            let rank = ranks[x].rank;
            for (let y in designerLookbooks) {
                let designerLookbook = designerLookbooks[y];
                if (designerLookbook.get('lookbookId') == id) {
                    await DesignerLookbookRepository.update(designerLookbook, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

// ****************************  Campaign  ****************************

pub.addCampaign = async (rank, designer, campaign) => {
    try {
        let designerId = designer.get('id');
        let campaignId = campaign.get('id');
        await DesignerCampaignRepository.create(rank, designerId, campaignId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteCampaign = async (designer, campaign) => {
    try {
        let designerId = designer.get('id');
        let campaignId = campaign.get('id');
        await DesignerCampaignRepository.deleteOne({designerId: designerId, campaignId: campaignId});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAllCampaigns = async (designer, pageOffset, itemSize) => {
    try {
        let id = designer.get('id');
        let total = await DesignerCampaignRepository.count(id);
        let designerCampaigns = await DesignerCampaignRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {designerId: id}});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designerCampaigns) {
            let campaignId = await designerCampaigns[x].get('campaignId');
            let campaign = await CampaignService.findOne({id:campaignId});
            let campaignViewModel = await CampaignService.createCampaignViewModel(campaign);
            campaignViewModel['rank'] = designerCampaigns[x].get('rank');
            list.push(campaignViewModel);
        }
        ret['campaigns'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateCampaignRanks = async (designer, ranks) => {
    try {
        let designerId = designer.get('id');
        let designerCampaigns = await DesignerCampaignRepository.findAllFilter({where: {designerId: designerId}});
        for (let x in ranks) {
            let id = ranks[x].campaignId;
            let rank = ranks[x].rank;
            for (let y in designerCampaigns) {
                let designerCampaign = designerCampaigns[y];
                if (designerCampaign.get('campaignId') == id) {
                    await DesignerLookbookRepository.update(designerCampaign, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

// ****************************  Branding  ****************************

pub.addBranding = async (rank, designer, branding) => {
    try {
        let designerId = designer.get('id');
        let brandingId = branding.get('id');
        await DesignerBrandingRepository.create(rank, designerId, brandingId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteBranding = async (designer, branding) => {
    try {
        let designerId = designer.get('id');
        let brandingId = branding.get('id');
        await DesignerBrandingRepository.deleteOne({designerId: designerId, brandingId: brandingId});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAllBrandings = async (designer, pageOffset, itemSize) => {
    try {
        let id = designer.get('id');
        let total = await DesignerBrandingRepository.count(id);
        let designerBrandingss = await DesignerBrandingRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {designerId: id}});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designerBrandingss) {
            let brandingId = await designerBrandingss[x].get('brandingId');
            let branding = await BrandingService.findOne({id:brandingId});
            let brandingViewModel = await BrandingService.createBrandingViewModel(branding);
            brandingViewModel['rank'] = designerBrandingss[x].get('rank');
            list.push(brandingViewModel);
        }
        ret['brandings'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateBrandingRanks = async (designer, ranks) => {
    try {
        let designerId = designer.get('id');
        let designerBrandings = await DesignerBrandingRepository.findAllFilter({where: {designerId: designerId}});
        for (let x in ranks) {
            let id = ranks[x].brandingId;
            let rank = ranks[x].rank;
            for (let y in designerBrandings) {
                let designerBranding = designerBrandings[y];
                if (designerBranding.get('brandingId') == id) {
                    await DesignerLookbookRepository.update(designerBranding, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

// ****************************  Cooperation  ****************************

pub.addCooperation = async (rank, designer, cooperation) => {
    try {
        let designerId = designer.get('id');
        let cooperationId = cooperation.get('id');
        await DesignerCooperationRepository.create(rank, designerId, cooperationId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteCooperation = async (designer, cooperation) => {
    try {
        let designerId = designer.get('id');
        let cooperationId = cooperation.get('id');
        await DesignerCooperationRepository.deleteOne({designerId: designerId, cooperationId: cooperationId});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAllCooperations = async (designer, pageOffset, itemSize) => {
    try {
        let id = designer.get('id');
        let total = await DesignerCooperationRepository.count(id);
        let designerCooperationss = await DesignerCooperationRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {designerId: id}});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designerCooperationss) {
            let cooperationId = await designerCooperationss[x].get('cooperationId');
            let cooperation = await CooperationService.findOne({id:cooperationId});
            let cooperationViewModel = await CooperationService.createCooperationViewModel(cooperation);
            cooperationViewModel['rank'] = designerCooperationss[x].get('rank');
            list.push(cooperationViewModel);
        }
        ret['cooperations'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateCooperationRanks = async (designer, ranks) => {
    try {
        let designerId = designer.get('id');
        let designerCooperations = await DesignerCooperationRepository.findAllFilter({where: {designerId: designerId}});
        for (let x in ranks) {
            let id = ranks[x].cooperationId;
            let rank = ranks[x].rank;
            for (let y in designerCooperations) {
                let designerCooperation = designerCooperations[y];
                if (designerCooperation.get('cooperationId') == id) {
                    await DesignerLookbookRepository.update(designerCooperation, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

module.exports = pub;
