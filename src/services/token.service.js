const jwt = require('jsonwebtoken');

const accountTokenRepo = require('../adapters/repositories/account_token.repository');
const userSessionTokenRepo = require('../adapters/repositories/user_session_token.repository');
const { getRandomString } = require('../utils/common');

const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
    generateAccountToken: async (userId) => {
        // Step 1: Generate token
        const length = Math.floor(Math.random() * 11) + 50; // token length random from 50 - 60
        const token = getRandomString(length);

        // Step 2: Set expiry time to 2 hours
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 2);

        // Step 3: Insert token record into database
        const tokenId = await accountTokenRepo.createAccountToken(userId, token, expiredAt);

        return token;
    },
    generateUserSessionToken: async (userId) => {
        const payload = {
            userId: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
        };

        const token = jwt.sign(payload, secretKey);

        const tokenId = await userSessionTokenRepo.createUserSessionToken(userId, token);

        return token;
    },
    verifyAccountToken: async (token) => {
        // Step 1: Check if token existed 
        const t = await accountTokenRepo.getAccountTokenByToken(token);
        if (!t) {
            return;
        }

        // Step 2: Check token not expired
        const now = new Date().getTime();
        const expiredAt = new Date(t.expired_at).getTime();
        if (now >= expiredAt) {
            return;
        }

        // Step 3: Update token to deleted
        const updatedToken = await accountTokenRepo.updateAccountTokenByToken(token, 1);

        return t;
    },
    verifyUserSessionToken: async (token) => {
        console.log(token);
        console.log(secretKey);
        // Verify is valid token
        const payload = jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error(err.message);
                return;
            }

            return decoded;
        })
        console.log(payload);

        // Check token existed in database
        const t = await userSessionTokenRepo.getUserSessionTokenByToken(token);
        if (!t) return;

        console.log(payload);
        return payload;
    },
}