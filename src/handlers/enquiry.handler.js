const enquiryServ = require('../services/enquiry.service');
const { userAuth } = require('../middleware/authorization');
const { dataToResp } = require('../utils/dto');

module.exports = {
    getAllEnquiries: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'getAllEnquiries');
            if (!auth) {
                return res.status(401).json();
            }

            var data = await enquiryServ.getAllEnquiries();
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    getEnquiryById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'getEnquiryById');
            if (!auth) {
                return res.status(401).json();
            }

            var data = await enquiryServ.getEnquiryById(req.params.id);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    createEnquiry: async (req, res) => {
        try {
            var data = await enquiryServ.createEnquiry(req.body);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    updateEnquiryById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'updateEnquiryById');
            if (!auth) {
                return res.status(401).json();
            }

            var data = await enquiryServ.updateEnquiryById(req.params.id, req.body);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    deleteEnquiryById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'deleteEnquiryById');
            if (!auth) {
                return res.status(401).json();
            }

            var data = await enquiryServ.deleteEnquiryById(req.params.id);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    }
}