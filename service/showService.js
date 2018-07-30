const ShowRepository = require('../orm/repository/showRepository');
const ShowLinkRepository = require('../orm/repository/ShowLinkRepository');
const SeasonRepository = require('../orm/repository/seasonRepository');
const DesignerService = require('./designerService');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.findOne = async (filter) => {
    return await ShowRepository.findOne(filter);
};

pub.create = async (name, desc, year, season, rank, key, localFile) => {
    try {
        let show = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            show = await ShowRepository.create(name, desc, year, season, rank, img);
        });
        let id = show.get('id');
        return {id: id};
    } catch (e) {
        return e;
    }
};

pub.getSeasons = async () => {
    try {
        let seasons = await SeasonRepository.findAll();
        let ret = [];
        for (let x in seasons) {
            let season = seasons[x];
            let year = season.get('year');
            let season_int = season.get('season');
            ret.push({year: year, season: season_int});
        }
        return ret;
    } catch (e) {
        return e;
    }
};

pub.createSeason = async (year, season) => {
    try {
        await SeasonRepository.findOrCreate(year, season);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteSeason = async (year, season) => {
    try {
        await SeasonRepository.deleteOne({year:year, season:season});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAll = async (pageOffset, itemSize) => {
    try {
        let total = await ShowRepository.count();
        let shows = await ShowRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, 'order': 'rank'});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for (let x in shows) {
            let show = shows[x];
            let id = show.get('id');
            let name = show.get('name');
            let desc = show.get('desc');
            let rank = show.get('rank');
            let season = show.get('season');
            let year = show.get('year');
            let img = await show.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push({id: id, name: name, desc: desc, rank: rank, year: year, img_id: img_id, img_url: img_url, season: season});
        }
        ret['shows'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.search = async (name) => {
    try {
        let shows = await ShowRepository.findAllFilter({
            'where': {'name': {'$like': '%'+name+'%'}},
            'order': 'rank'
        });
        let ret = {};
        let list = [];
        for (let x in shows) {
            let show = shows[x];
            let id = show.get('id');
            let name = show.get('name');
            let desc = show.get('desc');
            let rank = show.get('rank');
            let year = show.get('year');
            let img = await show.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push({id: id, name: name, desc: desc, rank: rank, year: year, img_id: img_id, img_url: img_url});
        }
        ret['shows'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.getAllByDesignerId = async (designerId) => {
  try {
      let shows = await ShowRepository.findAllFilter({where:{designerId:designerId}});
      let ret = {};
      let list = [];
      for (let x in shows) {
          let show = shows[x];
          let id = show.get('id');
          let name = show.get('name');
          let desc = show.get('desc');
          let rank = show.get('rank');
          let year = show.get('year');
          let img = await show.getCoverImg();
          let img_id = img.get('id');
          let img_url = img.get('url');
          list.push({id: id, name: name, desc: desc, rank: rank, year: year, img_id: img_id, img_url: img_url});
      }
      ret['shows'] = list;
      return ret;
  } catch (e) {
      return e;
  }
};

pub.getAllBySeason = async (year, season) => {
    try {
        let shows = await ShowRepository.findAllBySeason(year, season);
        let ret = {};
        let list = [];
        for (let x in shows) {
            let show = shows[x];
            let id = show.get('id');
            let name = show.get('name');
            let desc = show.get('desc');
            let rank = show.get('rank');
            let year = show.get('year');
            let img = await show.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push({id: id, name: name, desc: desc, rank: rank, year: year, img_id: img_id, img_url: img_url});
        }
        ret['shows'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.getAllByYear = async () => {
    try {
        let shows = await ShowRepository.findAllByYear();
        let ret = {};
        let list = [];
        let last = '';
        for (let x in shows) {
            let show = shows[x];
            let id = show.get('id');
            let name = show.get('name');
            let desc = show.get('desc');
            let rank = show.get('rank');
            let year = show.get('year');
            let img = await show.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            if (year != last) {
                if (list.length > 0) {
                    ret[last] = list;
                }
                list = [];
                last = year;
            }
            list.push({id: id, name: name, desc: desc, rank: rank, year: year, img_id: img_id, img_url: img_url});
        }
        ret[last] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateImg = async (show, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await ShowRepository.updateImg(show, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.update = async (show, name, desc, year, season) => {
    try {
        await ShowRepository.update(show, name, desc, year, season);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.updateDesigner = async (show, designerId) => {
    try {
        await ShowRepository.updateDesigner(show, designerId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.addShowLink = async (show, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await ShowRepository.addShowLink(show, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.addShowLinks = async (show, rank, files) => {
    try {
        let timestamp = Date.parse(new Date());
        for(let x in files) {
            let localFile = files[x].path;
            await pub.addShowLink(show, timestamp + x, localFile);
            rank++;
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.findShowLink = async (show, imgId) => {
    try {
        return await ShowRepository.findShowLinks(show, imgId);
    } catch (e) {
        return null;
    }
};

pub.deleteShowLink = async (showLink) => {
    try {
        await ShowRepository.deleteShowLink(showLink);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteShowLinks = async (show, ids) => {
    try {
        for(let x in ids) {
            let showLink = await pub.findShowLink(show, ids[x]);
            if (showLink) {
                await ShowRepository.deleteShowLink(showLink[0]);
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.updateRanks = async (ranks) => {
    try {
        let shows = await ShowRepository.findAll();
        for (let x in ranks) {
            let showId = ranks[x].showId;
            let rank = ranks[x].rank;
            for (let y in shows) {
                let show = shows[y];
                if (show.get('id') == showId) {
                    await ShowRepository.updateRank(show, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.updateShowLinkRanks = async (ranks) => {
    try {
        for (let x in ranks) {
            let showLink = await ShowLinkRepository.findOne({id:ranks[x].showLinkId});
            if (showLink) {
                await ShowRepository.updateRank(showLink, ranks[x].rank);
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await ShowRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createShowViewModel = async (show) => {
    try {
        let ret = {};
        ret['id'] = show.get('id');
        ret['name'] = show.get('name');
        ret['desc'] = show.get('desc');
        ret['rank'] = show.get('rank');
        ret['year'] = show.get('year');
        let img = await show.getCoverImg();
        ret['img_id'] = img.get('id');
        ret['img_url'] = img.get('url');
        let imgs = [];
        let showLinks = await show.getShowLinks();
        for(let x in showLinks) {
            let showLink = showLinks[x];
            let img1 = await showLink.getCoverImg();
            imgs.push({
                img_id: img1.get('id'),
                img_url: img1.get('url'),
                rank: showLink.get('rank'),
                show_link_id: showLink.get('id'),
            })
        }
        ret['imgs'] = imgs.sort((a, b) => { return a.rank - b.rank});
        let designer = await show.getDesigner();
        ret['designer'] = await DesignerService.createDesignerViewModel(designer);
        return ret;
    } catch (e) {
        return e;
    }
};

module.exports = pub;
