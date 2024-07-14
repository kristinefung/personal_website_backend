const tokenServ = require('../services/token.service');
const userServ = require('../services/user.service');

module.exports = {
    userAuth: async (authHeader, action) => {
        if (!authHeader) {
            return false;
        }

        var token = authHeader.split(' ')[1];
        if (!token) {
            return false;
        }

        var payload = await tokenServ.verifyUserSessionToken(token);
        if (!payload) {
            return false;
        }

        var hasPermission = false
        var userActions = await userServ.getUserActionsByUserId(payload.userId)
        if (userActions.error) {
            return false;
        }

        userActions.forEach((userAction) => {
            if (userAction.action === action) {
                hasPermission = true;
                return;
            }
        });
        if (!hasPermission) {
            return false;
        }

        return true;
    }
}