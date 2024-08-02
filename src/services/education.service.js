const educationRepo = require('../adapters/repositories/education.repository');

const { Err } = require('../utils/err');
const { CODE } = require('../utils/mapper');

module.exports = {
    getAllEducations: async () => {
        const educations = await educationRepo.getAll()
            .catch(err => {
                throw new Err('cannot get all educations from database', CODE.DATABASE_ERROR);
            });

        return educations;
    },
    getEducationById: async (educationId) => {
        // Step 0: Data validation
        if (!educationId) {
            throw new Err('educationId is required', CODE.INVALID_PARAM);
        }

        const education = await educationRepo.getById(educationId)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get education by id from database', CODE.DATABASE_ERROR);
            });
        if (!education.id) {
            throw new Err('no education found', CODE.INVALID_PARAM);
        }

        return education;
    },
    createEducation: async (edu) => {
        // Step 0: Data validation
        const currentYear = new Date().getFullYear();

        if (!edu.degree || !edu.subject || !edu.school_name || !edu.start_date_month || !edu.start_date_year) {
            throw new Err('degree, subject, school_name, start_date_month and start_date_year are required', CODE.INVALID_PARAM);
        }
        if (edu.is_current !== 0 && edu.is_current !== 1) {
            throw new Err('is_current must be 0 or 1', CODE.INVALID_PARAM);
        }
        if (!Number.isInteger(edu.start_date_month) || edu.start_date_month < 1 || edu.start_date_month > 12) {
            throw new Err('start_date_month must between 1 - 12 (inclusive)', CODE.INVALID_PARAM);
        }
        if (!Number.isInteger(edu.start_date_year) || edu.start_date_year < 1900 || edu.start_date_year > currentYear) {
            throw new Err(`start_date_year must between 1900 - ${currentYear} (inclusive)`, CODE.INVALID_PARAM);
        }
        if (edu.is_current === 0) {
            if (!edu.end_date_month || !edu.end_date_year) {
                throw new Err('end_date_month and end_date_year are required if is_current is false', CODE.INVALID_PARAM);
            }
            if (!Number.isInteger(edu.end_date_month) || edu.end_date_month < 1 || edu.end_date_month > 12) {
                throw new Err('end_date_month must between 1 - 12 (inclusive)', CODE.INVALID_PARAM);
            }
            if (!Number.isInteger(edu.end_date_year) || edu.end_date_year < 1900 || edu.end_date_year > currentYear) {
                throw new Err(`end_date_year must between 1900 - ${currentYear} (inclusive)`, CODE.INVALID_PARAM);
            }
            const startDate = new Date(edu.start_date_year, edu.start_date_month - 1, 1);
            const endDate = new Date(edu.end_date_year, edu.end_date_month - 1, 1);
            if (startDate > endDate) {
                throw new Err('start_date must before end_date', CODE.INVALID_PARAM);
            }
        }

        // Step 1: Insert education into database
        const dbEducationId = await educationRepo.create({
            degree: edu.degree,
            subject: edu.subject,
            schoolName: edu.school_name,
            description: edu.description ?? '',
            startDateMonth: edu.start_date_month,
            startDateYear: edu.start_date_year,
            endDateMonth: edu.is_current === 0 ? edu.end_date_month : null,
            endDateYear: edu.is_current === 0 ? edu.end_date_year : null,
            isCurrent: edu.is_current
        })
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot create education from database', CODE.DATABASE_ERROR);
            });

        return edu;
    },
    updateEducationById: async (id, edu) => {
        // Step 0: Data validation
        const currentYear = new Date().getFullYear();
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }
        if (!edu.degree || !edu.subject || !edu.school_name || !edu.start_date_month || !edu.start_date_year) {
            throw new Err('degree, subject, school_name, start_date_month and start_date_year are required', CODE.INVALID_PARAM);
        }
        if (edu.is_current !== 0 && edu.is_current !== 1) {
            throw new Err('is_current must be 0 or 1', CODE.INVALID_PARAM);
        }
        if (!Number.isInteger(edu.start_date_month) || edu.start_date_month < 1 || edu.start_date_month > 12) {
            throw new Err('start_date_month must between 1 - 12 (inclusive)', CODE.INVALID_PARAM);
        }
        if (!Number.isInteger(edu.start_date_year) || edu.start_date_year < 1900 || edu.start_date_year > currentYear) {
            throw new Err(`start_date_year must between 1900 - ${currentYear} (inclusive)`, CODE.INVALID_PARAM);
        }
        if (edu.is_current === 0) {
            if (!edu.end_date_month || !edu.end_date_year) {
                throw new Err('end_date_month and end_date_year are required if is_current is false', CODE.INVALID_PARAM);
            }
            if (!Number.isInteger(edu.end_date_month) || edu.end_date_month < 1 || edu.end_date_month > 12) {
                throw new Err('end_date_month must between 1 - 12 (inclusive)', CODE.INVALID_PARAM);
            }
            if (!Number.isInteger(edu.end_date_year) || edu.end_date_year < 1900 || edu.end_date_year > currentYear) {
                throw new Err(`end_date_year must between 1900 - ${currentYear} (inclusive)`, CODE.INVALID_PARAM);
            }
            const startDate = new Date(edu.start_date_year, edu.start_date_month - 1, 1);
            const endDate = new Date(edu.end_date_year, edu.end_date_month - 1, 1);
            if (startDate > endDate) {
                throw new Err('start_date must before end_date', CODE.INVALID_PARAM);
            }
        }

        // Step 1: Check education existed in database
        const dbEducation = await educationRepo.getById(id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get education by id from database', CODE.DATABASE_ERROR);
            });
        if (!dbEducation.id) {
            throw new Err('no education found', CODE.INVALID_PARAM);
        }

        // Step 2: Update education
        const changedRows = await educationRepo.updateById({
            id: id,
            degree: edu.degree,
            subject: edu.subject,
            schoolName: edu.school_name,
            description: edu.description ?? '',
            startDateMonth: edu.start_date_month,
            startDateYear: edu.start_date_year,
            endDateMonth: edu.is_current === 0 ? edu.end_date_month : null,
            endDateYear: edu.is_current === 0 ? edu.end_date_year : null,
            isCurrent: edu.is_current
        })
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot update education from database', CODE.DATABASE_ERROR);
            });

        return changedRows;
    },
    deleteEducationById: async (id) => {
        // Step 0: Data validation
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }

        // Step 1: Check education existed in database
        const dbEducation = await educationRepo.getById(id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get education by id from database', CODE.DATABASE_ERROR);
            });
        if (!dbEducation.id) {
            throw new Err('no education found', CODE.INVALID_PARAM);
        }

        // Step 2: Delete education
        const changedRows = await educationRepo.updateById({
            id: id,
            deleted: 1,
        })
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot update education from database', CODE.DATABASE_ERROR);
            });

        return changedRows;
    },

}