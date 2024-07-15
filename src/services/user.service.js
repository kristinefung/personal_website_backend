const bcrypt = require('bcrypt');

const userRepo = require('../adapters/repositories/user.repository');
const userActionRepo = require('../adapters/repositories/user_action.repository');
const tokenServ = require('./token.service');

const { getRandomString } = require('../utils/common');

module.exports = {
    getAllUsers: async () => {
        const users = await userRepo.getAllUsers();

        return users;
    },
    getUserById: async (userId) => {
        // Step 0: Data validation
        if (!userId) {
            return { error: 10, message: 'userId is required' };
        }

        const user = await userRepo.getUserById(userId);
        if (Object.keys(user).length == 0) {
            return { error: 12, message: 'no user found' };
        }

        return user;
    },
    createUser: async (user) => {
        // Step 0: Data validation
        if (!user.username || !user.display_name || !user.password) {
            return { error: 10, message: 'username, display_name and password are required' };
        }

        // Step 1: Check user not existed in database
        const dbUser = await userRepo.getUserByUsername(user.username);
        if (dbUser) {
            return { error: 20, message: 'user is already created' };
        }

        // Step 2: Hash user password
        const salt = getRandomString(20);
        const pw = user.password + salt;
        const hashedPw = await bcrypt.hash(pw, 10);

        // Step 3: Insert user into database
        const statusId = 1; // NOT_VERIFIED
        const roleId = 2; // Normal User
        const dbUserId = await userRepo.createUser({
            username: user.username,
            displayName: user.display_name,
            password: hashedPw,
            salt: salt,
            roleId: roleId,
            statusId: statusId
        });

        // Step 4: Generate verify account token
        const token = await tokenServ.generateVerifyAccountToken(dbUserId);

        // TODO: Step 5: Send confirmation email with verify token

        return user;
    },
    updateUserById: async (id, user) => {
        if (!id) {
            return { error: 10, message: 'id is required' };
        }

        const resp = await userRepo.updateUserById({
            id: id,
            displayName: user.display_name,
        });

        return resp;
    },
    deleteUserById: async (id) => {
        if (!id) {
            return { error: 10, message: 'id is required' };
        }

        const resp = await userRepo.updateUserById({
            id: id,
            deleted: 1,
        });

        return resp;
    },
    login: async (user) => {
        // Step 0: Data validation
        if (!user.username || !user.password) {
            return { error: 10, message: 'username and password are required' };
        }

        // Step 1: Check if username and password are correct
        const dbUser = await userRepo.getUserByUsername(user.username);
        if (!dbUser) {
            return { error: 21, message: 'username or password incorrect' };
        }

        const pw = user.password + dbUser.salt;
        const pwCorrect = await bcrypt.compare(pw, dbUser.password)
        if (!pwCorrect) {
            return { error: 21, message: 'username or password incorrect' };
        }

        // Step 2: Check if user status is active
        switch (dbUser.status_id) {
            case 1:
                return { error: 22, message: 'please verify your user account' };
            default:
                if (dbUser.status_id !== 0) {
                    return { error: 23, message: 'invalid user' };
                }
        }

        // Step 3: Generate user session token
        const token = await tokenServ.generateUserSessionToken(dbUser.id);

        // Step 4: Return token to user
        return token;
    },
    verifyUser: async (token) => {
        // Step 1: Verify token
        const t = await tokenServ.verifyVerifyAccountToken(token);
        if (!t) {
            return { error: 11, message: 'invalid token' };
        }

        // Step 2: Update user status to active
        const userId = t.user_id;
        const user = await userRepo.updateUserById({
            id: userId,
            statusId: 0 // ACTIVE
        });
        if (!user) {
            return { error: 99, message: 'Unknow Error: cannnot update user by id' };
        }

        return user;
    },
    getUserActionsByUserId: async (userId) => {
        // Step 0: Data validation
        if (!userId) {
            return { error: 10, message: 'userId is required' };
        }

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return { error: 99, message: 'Unknow Error: cannnot get user by id' };
        }

        const roleId = user.role_id;
        const userActions = await userActionRepo.getUserActionsByRoleId(roleId);

        return userActions;
    },

}