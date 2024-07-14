const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getAllEnquiries: async () => {
        var query = `SELECT * from enquiry WHERE deleted = 0`;
        var values = [];

        var results = await connectMysql(query, values);
        console.log(results);

        return results;
    },
    getEnquiryById: async (id) => {
        var query = `SELECT * from enquiry 
                        WHERE id = ? 
                        AND deleted = 0`;
        var values = [id];

        var results = await connectMysql(query, values);
        console.log(results);

        return results[0];
    },
    createEnquiry: async ({ name, email, companyName, phoneNo, comment, statusId }) => {
        var now = new Date();

        var query = "INSERT INTO `enquiry` (name, email, company_name, phone_no, comment, status_id, created_at, updated_at) VALUES(?,?,?,?,?,?,?,?)";
        var values = [name, email, companyName, phoneNo, comment, statusId, now, now];

        var results = await connectMysql(query, values);
        return results.insertId;
    },
    updateEnquiryById: async ({ id = null, name = null, email = null, companyName = null, phoneNo = null, comment = null, statusId = null, deleted = null }) => {
        var now = new Date();

        var query = `UPDATE enquiry
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
        var values = [name, email, companyName, phoneNo, comment, statusId, now, deleted, id];

        var results = await connectMysql(query, values);
        console.log(results);
        return results;
    }
}