const educationServ = require('../services/education.service');
const { userAuth } = require('../middleware/authorization');
const { dataToResp } = require('../utils/dto');

module.exports = {
    getAllEducations: async (req, res) => {
        try {
            const educations = await educationServ.getAllEducations();
            return res.status(200).json(dataToResp(0, "Success to get all educations", educations));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    getEducationById: async (req, res) => {
        try {
            const education = await educationServ.getEducationById(req.params.id);
            return res.status(200).json(dataToResp(0, "Success to get education", education));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    createEducation: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'createEducation');
            if (!auth) {
                return res.status(401).json();
            }

            const education = await educationServ.createEducation(req.body);
            return res.status(200).json(dataToResp(0, "Success to create education", education));

        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    updateEducationById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'updateEducationById');
            if (!auth) {
                return res.status(401).json();
            }

            const changedRows = await educationServ.updateEducationById(req.params.id, req.body);
            return res.status(200).json(dataToResp(0, "Success to update education", {}));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    deleteEducationById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'deleteEducationById');
            if (!auth) {
                return res.status(401).json();
            }

            const changedRows = await educationServ.deleteEducationById(req.params.id);
            return res.status(200).json(dataToResp(0, "Success to delete education", {}));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    }
}