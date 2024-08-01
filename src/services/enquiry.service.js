
const enquiryRepo = require('../adapters/repositories/enquiry.repository');

module.exports = {
    getAllEnquiries: async () => {
        const enquiries = await enquiryRepo.getAllEnquiries();

        return enquiries;
    },
    getEnquiryById: async (enquiryId) => {
        // Step 0: Data validation
        if (!enquiryId) {
            return { error: 10, message: 'email, enquiryId is required' };
        }

        const enquiry = await enquiryRepo.getEnquiryById(enquiryId);
        if (Object.keys(enquiry).length == 0) {
            return { error: 12, message: 'no enquiry found' };
        }

        return enquiry;
    },
    createEnquiry: async (enquiry) => {
        // Step 0: Data validation
        if (!enquiry.name || !enquiry.email || !enquiry.comment) {
            return { error: 10, message: 'name, email and comment is required' };
        }

        // Step 1: Insert enquiry into database
        const statusId = 1; // NOT_HANDLED
        const dbEnquiryId = await enquiryRepo.createEnquiry({
            name: enquiry.name,
            email: enquiry.email,
            companyName: enquiry.company_name ?? "",
            phoneNo: enquiry.phone_no ?? "",
            comment: enquiry.comment,
            statusId: statusId
        });

        // TODO: Step 2: Send receivication email to customer

        // TODO: Step 3: Send receivication email to admin

        return enquiry;
    },
    updateEnquiryById: async (id, enquiry) => {
        // Step 0: Data validation
        if (!id) {
            return { error: 10, message: 'id is required' };
        }

        const resp = await enquiryRepo.updateEnquiryById({
            id: id,
            statusId: enquiry.status_id,
        });

        return resp;
    },
    deleteEnquiryById: async (id) => {
        // Step 0: Data validation
        if (!enquiry.id) {
            return { error: 10, message: 'id is required' };
        }

        const resp = await enquiryRepo.updateEnquiryById({
            id: id,
            deleted: 1,
        });

        return resp;
    },

}