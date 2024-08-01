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
            const user = await userServ.getAllUsers();
            return res.status(200).json(dataToResp(0, "Success to get all users", user));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    getUserById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'getUserById');
            if (!auth) {
                return res.status(401).json();
            }
            const user = await userServ.getUserById(req.params.id);
            return res.status(200).json(dataToResp(0, "Success to update user", user));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    createUser: async (req, res) => {
        try {
            const user = await userServ.createUser(req.body);
            return res.status(200).json(dataToResp(0, "Success to create user", {}));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    updateUserById: async (req, res, next) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'updateUserById')
            if (!auth) {
                return res.status(401).json();
            }

            const user = await userServ.updateUserById(req.params.id, req.body);
            return res.status(200).json(dataToResp(0, "Success to update user", {}));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    deleteUserById: async (req, res) => {
        try {
            const auth = await userAuth(req.headers.authorization, 'deleteUserById');
            if (!auth) {
                return res.status(401).json();
            }
            const user = await userServ.deleteUserById(req.params.id);
            return res.status(200).json(dataToResp(0, "Success to delete user", {}));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    login: async (req, res) => {
        try {
            const token = await userServ.login(req.body);
            const data = { "user_session_token": token };
            return res.status(200).json(dataToResp(0, "Success to login", data));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}));
        }
    },
    verifyAccount: async (req, res) => {
        try {
            const { t } = req.query;
            if (!t) {
                return res.status(404).json();
            }

            const user = await userServ.verifyAccount(t);
            return res.status(200).json(dataToResp(0, "Success to verify account", {}));

        } catch (err) {
            return res.status(200).json(dataToResp(err.status, err.message, {}))
        }
    }
}