const userServ = require('../services/user.service');
const { userAuth } = require('../middleware/authorization');

const { dataToResp } = require('../utils/dto');

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'getAllUsers');
            if (!auth) {
                return res.status(401).json();
            }

            const data = await userServ.getAllUsers();
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }

            res.status(200).json(dataToResp(0, "Success", data));

        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    getUserById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'getUserById');
            if (!auth) {
                return res.status(401).json();
            }

            const data = await userServ.getUserById(req.params.id);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    createUser: async (req, res) => {
        try {
            const data = await userServ.createUser(req.body);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    updateUserById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'updateUserById');
            if (!auth) {
                return res.status(401).json();
            }

            const data = await userServ.updateUserById(req.params.id, req.body);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", {}));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    deleteUserById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'deleteUserById');
            if (!auth) {
                return res.status(401).json();
            }

            const data = await userServ.deleteUserById(req.params.id);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    login: async (req, res) => {
        try {
            const token = await userServ.login(req.body);
            if (token.error) {
                return res.status(200).json(dataToResp(token.error, token.message, {}));
            }
            const data = { "user_session_token": token }
            return res.status(200).json(dataToResp(0, "Success", data));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    },
    verifyAccount: async (req, res) => {
        try {
            const { t } = req.query;
            if (!t) {
                return res.status(404).json();
            }

            const data = await userServ.verifyAccount(t);
            if (data.error) {
                return res.status(200).json(dataToResp(data.error, data.message, {}));
            }
            return res.status(200).json(dataToResp(0, "Success", {}));
        } catch (err) {
            console.error(err.message);
            return res.status(500).json();
        }
    }
}