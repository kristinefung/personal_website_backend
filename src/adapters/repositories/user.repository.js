const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getAllUsers: async (inclPw = false) => {
        let query = '';
        if (inclPw) {
            query = `SELECT * from user WHERE deleted = 0`;
        } else {
            query = `SELECT id, email, display_name, role_id, status_id, created_at, updated_at, deleted from user WHERE deleted = 0`;
        }

        const results = await connectMysql(query);

        return results;
    },
    getUserById: async (userId, inclPw = false) => {
        let query = '';
        if (inclPw) {
            query = `SELECT * from user WHERE id = ? AND deleted = 0`;
        } else {
            query = `SELECT id, email, display_name, role_id, status_id, created_at, updated_at, deleted from user WHERE id = ? AND deleted = 0`;
        }
        const values = [userId];

        const results = await connectMysql(query, values);
        console.log(results);

        return results.length > 0 ? results[0] : {};
    },
    getUserByEmail: async (email) => {
        const query = `SELECT * from user WHERE email = ? AND deleted = 0`;
        const values = [email];

        const results = await connectMysql(query, values);

        return results.length > 0 ? results[0] : {};
    },
    createUser: async ({ email, displayName, password, salt, roleId, statusId }) => {
        const now = new Date();
        const query = `INSERT INTO user 
                        (email, display_name, password, salt, role_id, status_id, created_at, updated_at) 
                        VALUES(?,?,?,?,?,?,?,?)`;
        const values = [email, displayName, password, salt, roleId, statusId, now, now];

        const results = await connectMysql(query, values);
        return results.insertId;
    },
    updateUserById: async ({ id, email = null, displayName = null, password = null, salt = null, roleId = null, statusId = null, deleted = null }) => {
        const now = new Date();

        const query = `UPDATE user
                        SET 
                            email = COALESCE(?, email), 
                            display_name = COALESCE(?, display_name), 
                            password = COALESCE(?, password), 
                            salt = COALESCE(?, salt), 
                            role_id = COALESCE(?, role_id), 
                            status_id = COALESCE(?, status_id), 
                            updated_at = ?,
                            deleted = COALESCE(?, deleted)
                        WHERE id = ?`;
        const values = [email, displayName, password, salt, roleId, statusId, now, deleted, id];

        const results = await connectMysql(query, values);
        console.log(results.changedRows);
        return results.changedRows;
    }
}