const bcrypt = require('bcrypt');

const userRepo = require('../adapters/repositories/user.repository');
const userActionRepo = require('../adapters/repositories/user_action.repository');
const tokenServ = require('./token.service');

const { getRandomString } = require('../utils/common');

module.exports = {
    getAllUsers: async () => {
        var users = await userRepo.getAllUsers();

        return users;
    },
    getUserById: async (userId) => {
        // Step 0: Data validation
        if (!userId) {
            return { error: 10, message: 'userId is required' };
        }

        var user = await userRepo.getUserById(userId);

        return user;
    },
    createUser: async (user) => {
        // Step 0: Data validation
        if (!user.username || !user.display_name || !user.password) {
            return { error: 10, message: 'username, display_name and password are required' };
        }

        // Step 1: Check user not existed in database
        var dbUser = await userRepo.getUserByUsername(user.username);
        if (dbUser) {
            return { error: 20, message: 'user is already created' };
        }

        // Step 2: Hash user password
        var salt = getRandomString(20);
        var pw = user.password + salt;
        var hashedPw = await bcrypt.hash(pw, 10);

        // Step 3: Insert user into database
        var statusId = 1; // NOT_VERIFIED
        var dbUserId = await userRepo.createUser({
            username: user.username,
            displayName: user.display_name,
            password: hashedPw,
            salt: salt,
            statusId: statusId
        });

        // Step 4: Generate verify account token
        var token = await tokenServ.generateVerifyAccountToken(dbUserId);

        // TODO: Step 5: Send confirmation email with verify token

        return user;
    },
    updateUserById: async (id, user) => {
        if (!id) {
            return { error: 10, message: 'id is required' };
        }

        var resp = await userRepo.updateUserById({
            id: id,
            displayName: user.display_name,
        });

        return resp;
    },
    deleteUserById: async (id) => {
        if (!id) {
            return { error: 10, message: 'id is required' };
        }

        var resp = await userRepo.updateUserById({
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
        var dbUser = await userRepo.getUserByUsername(user.username);
        if (!dbUser) {
            return { error: 21, message: 'username or password is incorrect' };
        }

        var pw = user.password + dbUser.salt;
        var pwCorrect = await bcrypt.compare(pw, dbUser.password)
        if (!pwCorrect) {
            return { error: 21, message: 'username or password is incorrect' };
        }

        // TODO: Check if user status is active

        // Step 2: Generate user session token
        var token = tokenServ.generateUserSessionToken(dbUser.id);

        // Step 3: Return token to user
        return token;
    },
    getUserActionsByUserId: async (userId) => {
        // Step 0: Data validation
        if (!userId) {
            return { error: 10, message: 'userId is required' };
        }

        var user = await userRepo.getUserById(userId);
        if (!user) {
            return { error: 99, message: 'cannnot get user by id' };
        }

        var roleId = user.role_id;
        console.log(user);
        var userActions = await userActionRepo.getUserActionsByRoleId(roleId);

        console.log(userActions);
        return userActions;
    },

}