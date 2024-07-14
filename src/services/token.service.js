const jwt = require('jsonwebtoken');

const verifyAccountTokenRepo = require('../adapters/repositories/verify_account_token.repository');
const userSessionTokenRepo = require('../adapters/repositories/user_session_token.repository');
const { getRandomString } = require('../utils/common');

const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
    generateVerifyAccountToken: async (userId) => {
        // Step 1: Generate token
        var length = Math.floor(Math.random() * 11) + 50; // token length random from 50 - 60
        var token = getRandomString(length);

        // Step 2: Set expiry time to 2 hours
        var expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 2);

        // Step 3: Insert token record into database
        var tokenId = await verifyAccountTokenRepo.createVerifyAccountToken(userId, token, expiredAt);

        return token;
    },
    generateUserSessionToken: async (userId) => {
        const payload = {
            userId: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
        };

        var token = jwt.sign(payload, secretKey);

        var tokenId = await userSessionTokenRepo.createUserSessionToken(userId, token);

        return token;
    },
    verifyVerifyAccountToken: async (token) => {
        // Step 1: Check if token existed 
        var t = await verifyAccountTokenRepo.getVerifyAccountTokenByToken(token);
        if (!t) {
            return;
        }

        // Step 2: Check token not expired
        var now = new Date().getTime();
        var expiredAt = new Date(t.expired_at).getTime();
        if (now >= expiredAt) {
            return;
        }

        // Step 3: Update token to deleted
        var updatedToken = await verifyAccountTokenRepo.updateVerifyAccountTokenByToken(token, 1);

        return t;
    },
    verifyUserSessionToken: async (token) => {
        var payload;

        // Verify is valid token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) return payload;

            payload = decoded;
        })

        // Check token existed in database
        var t = await userSessionTokenRepo.getUserSessionTokenByToken(token);
        if (!t) return payload;

        return payload;
    },
}