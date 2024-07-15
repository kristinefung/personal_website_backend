const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getVerifyAccountTokenByToken: async (token) => {
        const query = "SELECT * from `verify_account_token` WHERE `token` = ? AND deleted = 0";
        const values = [token];

        const results = await connectMysql(query, values);

        return results.length > 0 ? results[0] : {};
    },
    createVerifyAccountToken: async (userId, token, expiredAt) => {
        const now = new Date();

        const query = "INSERT INTO `verify_account_token` (user_id, token, created_at, updated_at, expired_at) VALUES(?,?,?,?,?)";
        const values = [userId, token, now, now, expiredAt];

        const results = await connectMysql(query, values);
        return results.insertId;
    },
    updateVerifyAccountTokenByToken: async (token, deleted = null) => {
        const now = new Date();
        const query = `UPDATE verify_account_token
        SET 
            updated_at = ?,
            deleted = COALESCE(?, deleted)
        WHERE token = ?`;
        const values = [now, deleted, token];

        const results = await connectMysql(query, values);
        return results.length > 0 ? results[0] : {};
    },
}