const workServ = require('../services/work.service');
const { userAuth } = require('../middleware/authorization');
const { dataToResp } = require('../utils/dto');

module.exports = {
    getAllWorks: async (req, res) => {
        try {
            const works = await workServ.getAllWorks();
            return res.status(200).json(dataToResp(0, "Success to get all works", works));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    getWorkById: async (req, res) => {
        try {
            const work = await workServ.getWorkById(req.params.id);
            return res.status(200).json(dataToResp(0, "Success to get work", work));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    createWork: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'createWork');
            if (!auth) {
                return res.status(401).json();
            }

            const work = await workServ.createWork(req.body);
            return res.status(200).json(dataToResp(0, "Success to create work", work));

        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    updateWorkById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'updateWorkById');
            if (!auth) {
                return res.status(401).json();
            }

            const changedRows = await workServ.updateWorkById(req.params.id, req.body);
            return res.status(200).json(dataToResp(0, "Success to update work", {}));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    deleteWorkById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'deleteWorkById');
            if (!auth) {
                return res.status(401).json();
            }

            const changedRows = await workServ.deleteWorkById(req.params.id);
            return res.status(200).json(dataToResp(0, "Success to delete work", {}));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    }
}