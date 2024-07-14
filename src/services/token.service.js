const jwt = require('jsonwebtoken');

const verifyAccountTokenRepo = require('../adapters/repositories/verify_account_token.repository');
const userSessionTokenRepo = require('../adapters/repositories/user_session_token.repository');
const { getRandomString } = require('../utils/common');

const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
    generateVerifyAccountToken: async (userId) => {
        // Step 1: Generate token
        var token = getRandomString(50);

        // Step 2: Set expiry time to 3 hours
        var expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 3);

        // Step 3: Insert token record into database
        var tokenId = await verifyAccountTokenRepo.createVerifyAccountToken(userId, token, expiredAt);

        return token;
    },
    generateUserSessionToken: async (userId) => {
        const payload = {
            userId: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hour
        };

        var token = jwt.sign(payload, secretKey);
        console.log(token);

        var tokenId = await userSessionTokenRepo.createUserSessionToken(userId, token);

        return token
    },
    verifyUserSessionToken: async (token) => {
        var payload;

        // Verify is valid token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) return payload;

            payload = decoded;
        })

        console.log(token);
        // Check token existed in database
        var t = await userSessionTokenRepo.getUserSessionTokenByToken(token);
        if (!t) return payload;

        return payload;
    },
}