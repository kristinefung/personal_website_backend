const mailGun = require('../adapters/apis/mail_gun');
const enquiryRepo = require('../adapters/repositories/enquiry.repository');

const { Err } = require('../utils/err');
const { CODE } = require('../utils/mapper');

module.exports = {
    getAllEnquiries: async () => {
        const enquiries = await enquiryRepo.getAllEnquiries()
            .catch(err => {
                throw new Err('cannot get all enquiries from database', CODE.DATABASE_ERROR);
            });

        return enquiries;
    },
    getEnquiryById: async (enquiryId) => {
        // Step 0: Data validation
        if (!enquiryId) {
            throw new Err('enquiryId is required', CODE.INVALID_PARAM);
        }

        const enquiry = await enquiryRepo.getEnquiryById(enquiryId)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get user by id from database', CODE.DATABASE_ERROR);
            });
        if (!enquiry.id) {
            throw new Err('no enquiry found', CODE.INVALID_PARAM);
        }

        return enquiry;
    },
    createEnquiry: async (enquiry) => {
        // Step 0: Data validation
        if (!enquiry.name || !enquiry.email || !enquiry.comment) {
            throw new Err('name, email and comment is required', CODE.INVALID_PARAM);
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
        })
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot create enquiry from database', CODE.DATABASE_ERROR);
            });
        // TODO: Step 2: Send receivication email to customer

        // TODO: Step 3: Send receivication email to admin
        await mailGun.sendReceivicationEmailToAdmin()
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot send receivication email to admin', CODE.UNKNOWN_ERROR);
            });

        return enquiry;
    },
    updateEnquiryById: async (id, enquiry) => {
        // Step 0: Data validation
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }

        // Step 1: Check enquiry existed in database
        const dbEnquiry = await enquiryRepo.getEnquiryById(id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get enquiry by id from database', CODE.DATABASE_ERROR);
            });
        if (!dbEnquiry.id) {
            throw new Err('no enquiry found', CODE.INVALID_PARAM);
        }

        // Step 2: Update enquiry
        const resp = await enquiryRepo.updateEnquiryById({
            id: id,
            statusId: enquiry.status_id,
        })
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot update enquiry from database', CODE.DATABASE_ERROR);
            });

        return resp;
    },
    deleteEnquiryById: async (id) => {
        // Step 0: Data validation
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }

        // Step 1: Check enquiry existed in database
        const dbEnquiry = await enquiryRepo.getEnquiryById(id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get enquiry by id from database', CODE.DATABASE_ERROR);
            });
        if (!dbEnquiry.id) {
            throw new Err('no enquiry found', CODE.INVALID_PARAM);
        }

        // Step 2: Delete enquiry
        const resp = await enquiryRepo.updateEnquiryById({
            id: id,
            deleted: 1,
        });

        return resp;
    },

}