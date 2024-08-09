const tokenServ = require('../services/token.service');
const { dataToResp } = require('../utils/dto');

module.exports = {
    verifyUserSessionToken: async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).json();
            }

            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json();
            }

            const payload = await tokenServ.verifyUserSessionToken(token);
            if (!payload) {
                return res.status(401).json();
            }

            return res.status(200).json(dataToResp(0, "Success to verify user session token", {}));

        } catch (err) {
            return res.status(401).json();
        }
    }
}