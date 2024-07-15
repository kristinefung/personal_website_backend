const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getAllEnquiries: async () => {
        const query = `SELECT * from enquiry WHERE deleted = 0`;
        const values = [];

        const results = await connectMysql(query, values);

        return results;
    },
    getEnquiryById: async (id) => {
        const query = `SELECT * from enquiry 
                        WHERE id = ? 
                        AND deleted = 0`;
        const values = [id];

        const results = await connectMysql(query, values);

        return results.length > 0 ? results[0] : {};
    },
    createEnquiry: async ({ name, email, companyName, phoneNo, comment, statusId }) => {
        const now = new Date();

        const query = "INSERT INTO `enquiry` (name, email, company_name, phone_no, comment, status_id, created_at, updated_at) VALUES(?,?,?,?,?,?,?,?)";
        const values = [name, email, companyName, phoneNo, comment, statusId, now, now];

        const results = await connectMysql(query, values);
        return results.insertId;
    },
    updateEnquiryById: async ({ id = null, name = null, email = null, companyName = null, phoneNo = null, comment = null, statusId = null, deleted = null }) => {
        const now = new Date();

        const query = `UPDATE enquiry
                        SET 
                            name = COALESCE(?, name), 
                            email = COALESCE(?, email), 
                            company_name = COALESCE(?, company_name), 
                            phone_no = COALESCE(?, phone_no), 
                            comment = COALESCE(?, comment), 
                            status_id = COALESCE(?, status_id), 
                            updated_at = ?,
                            deleted = COALESCE(?, deleted)
                        WHERE id = ?`;
        const values = [name, email, companyName, phoneNo, comment, statusId, now, deleted, id];

        const results = await connectMysql(query, values);
        return results;
    }
}