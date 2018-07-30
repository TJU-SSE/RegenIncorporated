const WorkerRepository = require('../orm/repository/workerRepository');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.getTotalSize = async () => {
    return await WorkerRepository.getTotalSize()
};

pub.findOne = async (filter) => {
    return await WorkerRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await WorkerRepository.findAllFilter(filter);
};

pub.create = async (key, localFile, name, email, rank, identity) => {
    try {
        let worker = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            worker = await WorkerRepository.create(name, email, rank, img, identity);
        });
        let id = worker.get('id');
        let img = await worker.getCoverImg();
        return {id:id, img_url: img.get('url')};
    } catch (e) {
        return e;
    }
};

pub.updateImg = async (worker, key, localFile) => {
    try {
        let newImg = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await WorkerRepository.updateImg(worker, img);
            newImg = img
        });
        return newImg.get('url');
    } catch (e) {
        return e;
    }
};

pub.update = async (worker, name, email, desc, rank) => {
    try {
        await WorkerRepository.update(worker, name, email, desc, rank);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await WorkerRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createWorkerViewModel = async (worker) => {
    try {
        let id = worker.get('id');
        let name = worker.get('name');
        let email = worker.get('email');
        let rank = worker.get('rank');
        let img = await worker.getCoverImg();
        let img_id = img.get('id');
        let img_url = img.get('url');
        return {
            id: id,
            name: name,
            email: email,
            rank: rank,
            img_id: img_id,
            img_url: img_url
        };
    } catch (e) {
        return e;
    }
};

pub.createWorkersViewModel = async (workers, pageOffset, itemSize, total) => {
    try {
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in workers) {
            let worker = workers[x];
            let id = worker.get('id');
            let name = worker.get('name');
            let email = worker.get('email');
            let rank = worker.get('rank');
            let img = await worker.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push({
                id: id,
                name: name,
                email: email,
                rank: rank,
                identity: worker.get('identity'),
                img_id: img_id,
                img_url: img_url
            })
        }
        ret['workers'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateRanks = async (ranks) => {
    try {
        let workers = await WorkerRepository.findAll();
        for (let x in ranks) {
            let id = ranks[x].id;
            let rank = ranks[x].rank;
            for (let y in workers) {
                let worker = workers[y];
                if (worker.get('id') == id) {
                    await WorkerRepository.updateRank(worker, rank);
                }
            }
        }
        return "success";
    } catch (e) {
        return e;
    }
};

module.exports = pub;
