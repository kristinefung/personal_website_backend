const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getAllUsers: async (inclPw = false) => {
        let query = '';
        if (inclPw) {
            query = `SELECT * from user WHERE deleted = 0`;
        } else {
            query = `SELECT id, username, display_name, role_id, status_id, created_at, updated_at, deleted from user WHERE deleted = 0`;
        }

        const results = await connectMysql(query);

        return results;
    },
    getUserById: async (userId, inclPw = false) => {
        let query = '';
        if (inclPw) {
            query = `SELECT * from user WHERE id = ? AND deleted = 0`;
        } else {
            query = `SELECT id, username, display_name, role_id, status_id, created_at, updated_at, deleted from user WHERE id = ? AND deleted = 0`;
        }
        const values = [userId];

        const results = await connectMysql(query, values);
        console.log(results);

        return results.length > 0 ? results[0] : {};
    },
    getUserByUsername: async (username) => {
        const query = `SELECT * from user WHERE username = ? AND deleted = 0`;
        const values = [username];

        const results = await connectMysql(query, values);

        return results.length > 0 ? results[0] : {};
    },
    createUser: async ({ username, displayName, password, salt, roleId, statusId }) => {
        const now = new Date();
        const query = `INSERT INTO user 
                        (username, display_name, password, salt, role_id, status_id, created_at, updated_at) 
                        VALUES(?,?,?,?,?,?,?,?)`;
        const values = [username, displayName, password, salt, roleId, statusId, now, now];

        const results = await connectMysql(query, values);
        return results.insertId;
    },
    updateUserById: async ({ id, username = null, displayName = null, password = null, salt = null, roleId = null, statusId = null, deleted = null }) => {
        const now = new Date();

        const query = `UPDATE user
                        SET 
                            username = COALESCE(?, username), 
                            display_name = COALESCE(?, display_name), 
                            password = COALESCE(?, password), 
                            salt = COALESCE(?, salt), 
                            role_id = COALESCE(?, role_id), 
                            status_id = COALESCE(?, status_id), 
                            updated_at = ?,
                            deleted = COALESCE(?, deleted)
                        WHERE id = ?`;
        const values = [username, displayName, password, salt, roleId, statusId, now, deleted, id];

        const results = await connectMysql(query, values);
        return results;
    }
}