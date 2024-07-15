const tokenServ = require('../services/token.service');
const userServ = require('../services/user.service');

module.exports = {
    userAuth: async (authHeader, action) => {
        if (!authHeader) {
            console.log("!authHeader");
            return false;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log("!token");
            return false;
        }

        const payload = await tokenServ.verifyUserSessionToken(token);
        if (!payload) {
            console.log("!payload");
            return false;
        }

        const userActions = await userServ.getUserActionsByUserId(payload.userId)
        if (userActions.error) {
            console.log("userActions.error");
            return false;
        }

        var hasPermission = false;
        userActions.forEach((userAction) => {
            if (userAction.action === action) {
                console.log("userAction.action === action");
                hasPermission = true;
                return;
            }
        });
        if (!hasPermission) {
            console.log("!hasPermission");
            return false;
        }

        return true;
    }
}