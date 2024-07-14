const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getAllUsers: async (inclPw = false) => {
        var query = '';
        if (inclPw) {
            query = `SELECT * from user WHERE deleted = 0`;
        } else {
            query = `SELECT id, username, display_name, role_id, status_id, created_at, updated_at, deleted from user WHERE deleted = 0`;
        }

        var results = await connectMysql(query);
        console.log(results);

        return results;
    },
    getUserById: async (userId, inclPw = false) => {
        var query = '';
        if (inclPw) {
            query = `SELECT * from user WHERE id = ? AND deleted = 0`;
        } else {
            query = `SELECT id, username, display_name, role_id, status_id, created_at, updated_at, deleted from user WHERE id = ? AND deleted = 0`;
        }
        var values = [userId];

        var results = await connectMysql(query, values);
        console.log(results);

        return results[0];
    },
    getUserByUsername: async (username) => {
        var query = `SELECT * from user WHERE username = ? AND deleted = 0`;
        var values = [username];

        var results = await connectMysql(query, values);
        console.log(results);

        return results[0];
    },
    createUser: async ({ username, displayName, password, salt, statusId }) => {
        var now = new Date();
        var query = `INSERT INTO user 
                        (username, display_name, password, salt, status_id, created_at, updated_at) 
                        VALUES(?,?,?,?,?,?,?)`;
        var values = [username, displayName, password, salt, statusId, now, now];

        var results = await connectMysql(query, values);
        return results.insertId;
    },
    updateUserById: async ({ id, username = null, displayName = null, password = null, salt = null, statusId = null, deleted = null }) => {
        var now = new Date();

        var query = `UPDATE user
                        SET 
                            username = COALESCE(?, username), 
                            display_name = COALESCE(?, display_name), 
                            password = COALESCE(?, password), 
                            salt = COALESCE(?, salt), 
                            status_id = COALESCE(?, status_id), 
                            updated_at = ?,
                            deleted = COALESCE(?, deleted)
                        WHERE id = ?`;
        var values = [username, displayName, password, salt, statusId, now, deleted, id];

        var results = await connectMysql(query, values);
        console.log(results);
        return results;
    }
}