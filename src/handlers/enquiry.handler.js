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
            const data = await enquiryServ.getAllEnquiries();
            return res.status(200).json(dataToResp(0, "Success to get all enquiries", data));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    getEnquiryById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'getEnquiryById');
            if (!auth) {
                return res.status(401).json();
            }

            const data = await enquiryServ.getEnquiryById(req.params.id);
            return res.status(200).json(dataToResp(0, "Success to get enquiry", data));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    createEnquiry: async (req, res) => {
        try {
            const data = await enquiryServ.createEnquiry(req.body);
            return res.status(200).json(dataToResp(0, "Success to create enquiry", data));

        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    updateEnquiryById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'updateEnquiryById');
            if (!auth) {
                return res.status(401).json();
            }

            const data = await enquiryServ.updateEnquiryById(req.params.id, req.body);
            return res.status(200).json(dataToResp(0, "Success to update enquiry", {}));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    deleteEnquiryById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'deleteEnquiryById');
            if (!auth) {
                return res.status(401).json();
            }

            const data = await enquiryServ.deleteEnquiryById(req.params.id);
            return res.status(200).json(dataToResp(0, "Success to delete enquiry", data));
        } catch (err) {
            console.error(err.message);
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    }
}