const bcrypt = require('bcrypt');

const mailGun = require('../adapters/apis/mail_gun');
const userRepo = require('../adapters/repositories/user.repository');
const userActionRepo = require('../adapters/repositories/user_action.repository');
const tokenServ = require('./token.service');

const { USER_STATUS, ROLE } = require('../utils/mapper');
const { logger } = require('../utils/logger');
const { getRandomString } = require('../utils/common');

const { Err } = require('../utils/err');
const { CODE } = require('../utils/mapper');

module.exports = {
    getAllUsers: async () => {
        const users = await userRepo.getAllUsers()
            .catch(err => {
                throw new Err('cannot get all users from database', CODE.DATABASE_ERROR);
            });

        return users;
    },
    getUserById: async (userId) => {
        // Step 0: Data validation
        if (!userId) {
            throw new Err('userId is required', CODE.INVALID_PARAM);
        }

        const user = await userRepo.getUserById(userId)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get user by id from database', CODE.DATABASE_ERROR);
            });
        if (!user.id) {
            throw new Err('no user found', CODE.USER_NOT_EXISTED);
        }

        return user;
    },
    createUser: async (user) => {
        // Step 0: Data validation
        if (!user.email || !user.display_name || !user.password) {
            throw new Err('email, display_name and password are required', CODE.INVALID_PARAM);
        }

        // Step 1: Check user not existed in database
        const dbUser = await userRepo.getUserByEmail(user.email)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get user from database', CODE.DATABASE_ERROR);
            });
        if (dbUser.id) {
            throw new Err('user is already created', CODE.USER_EXISTED);
        }

        // Step 2: Hash user password
        const salt = getRandomString(20);
        const pw = user.password + salt;
        const hashedPw = await bcrypt.hash(pw, 10)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot hash password', CODE.UNKNOWN_ERROR);
            });

        // Step 3: Insert user into database
        const dbUserId = await userRepo.createUser({
            email: user.email,
            displayName: user.display_name,
            password: hashedPw,
            salt: salt,
            roleId: ROLE.USER,
            statusId: USER_STATUS.NOT_VERIFIED
        }).catch(err => {
            logger.error(err.message);
            throw new Err('cannot create user in database', CODE.DATABASE_ERROR);
        });

        // Step 4: Generate account token
        const token = await tokenServ.generateAccountToken(dbUserId)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot generate verify account token', CODE.UNKNOWN_ERROR);
            });

        // Step 5: Send confirmation email with account token
        await mailGun.sendConfirmationEmail(user.email, token)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot send confirmation email', CODE.UNKNOWN_ERROR);
            });

        return {};
    },
    updateUserById: async (id, user) => {
        // Step 0: Data validation
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }

        // Step 1: Check user existed in database
        const dbUser = await userRepo.getUserById(id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get user by id from database', CODE.DATABASE_ERROR);
            });
        if (!dbUser.id) {
            throw new Err('no user found', CODE.USER_NOT_EXISTED);
        }

        // Step 2: Update user by id
        const changedRows = await userRepo.updateUserById({
            id: id,
            displayName: user.display_name,
        }).catch(err => {
            throw new Err('cannot update user by id in database', CODE.DATABASE_ERROR);
        });

        return changedRows;
    },
    deleteUserById: async (id) => {
        // Step 0: Data validation
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }

        // Step 1: Check user existed in database
        const dbUser = await userRepo.getUserById(id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get user by id from database', CODE.DATABASE_ERROR);
            });
        if (!dbUser.id) {
            throw new Err('no user found', CODE.USER_NOT_EXISTED);
        }

        // Step 2: Delete user by id
        const user = await userRepo.updateUserById({
            id: id,
            deleted: 1,
        }).catch(err => {
            throw new Err('cannot update user by id in database', CODE.DATABASE_ERROR);
        });

        return user;
    },
    login: async (user) => {
        // Step 0: Data validation
        if (!user.email || !user.password) {
            throw new Err('email and password are required', CODE.INVALID_PARAM);
        }

        // Step 1: Check if email and password are correct
        const dbUser = await userRepo.getUserByEmail(user.email)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get user by email in database', CODE.DATABASE_ERROR);
            });
        if (!dbUser.id) {
            throw new Err('email or password incorrect', CODE.INCORRECT_CREDENTIAL);
        }

        const pw = user.password + dbUser.salt;
        const pwCorrect = await bcrypt.compare(pw, dbUser.password)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot compare password', CODE.UNKNOWN_ERROR);
            });
        if (!pwCorrect) {
            throw new Err('email or password incorrect', CODE.INCORRECT_CREDENTIAL);
        }

        // Step 2: Check if user status is active
        switch (dbUser.status_id) {
            case USER_STATUS.NOT_VERIFIED:
                throw new Err('please verify your user account', CODE.USER_NOT_VERIFIED);
        }

        // Step 3: Generate user session token
        const token = await tokenServ.generateUserSessionToken(dbUser.id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot generate user session token', CODE.UNKNOWN_ERROR);
            });

        // Step 4: Return token to user
        return token;
    },
    verifyAccount: async (token) => {
        // Step 1: Verify token
        const t = await tokenServ.verifyAccountToken(token)
            .catch(err => {
                throw new Err('cannot verify account token', CODE.UNKNOWN_ERROR);
            });
        if (!t) {
            throw new Err('invalid token', CODE.INVALID_PARAM);
        }

        // Step 2: Update user status to active
        const userId = t.user_id;
        const user = await userRepo.updateUserById({
            id: userId,
            statusId: USER_STATUS.ACTIVE
        }).catch(err => {
            throw new Err('cannnot update user by id', CODE.DATABASE_ERROR);
        });

        return user;
    },
    getUserActionsByUserId: async (userId) => {
        // Step 0: Data validation
        if (!userId) {
            throw new Err('userId is required', CODE.INVALID_PARAM);
        }

        const user = await userRepo.getUserById(userId)
            .catch(err => {
                throw new Err('cannnot get user by id', CODE.DATABASE_ERROR);
            });

        const userActions = await userActionRepo.getUserActionsByRoleId(user.role_id)
            .catch(err => {
                throw new Err('cannnot get user actions by role id', CODE.DATABASE_ERROR);
            });

        return userActions;
    },

}