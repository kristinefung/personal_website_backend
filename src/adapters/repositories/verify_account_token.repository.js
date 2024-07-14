const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getVerifyAccountTokenByToken: async (token) => {
        var query = "SELECT * from `verify_account_token` WHERE `token` = ? AND deleted = 0";
        var values = [token];

        var results = await connectMysql(query, values);

        return results[0];
    },
    createVerifyAccountToken: async (userId, token, expiredAt) => {
        var now = new Date();

        var query = "INSERT INTO `verify_account_token` (user_id, token, created_at, updated_at, expired_at) VALUES(?,?,?,?,?)";
        var values = [userId, token, now, now, expiredAt];

        var results = await connectMysql(query, values);
        return results.insertId;
    },
    updateVerifyAccountTokenByToken: async (token, deleted = null) => {
        var now = new Date();
        var query = `UPDATE verify_account_token
        SET 
            updated_at = ?,
            deleted = COALESCE(?, deleted)
        WHERE token = ?`;
        var values = [now, deleted, token];

        var results = await connectMysql(query, values);
        return results[0];
    },
}