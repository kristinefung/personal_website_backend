const educationRepo = require('../adapters/repositories/education.repository');

const { isValidDate } = require('../utils/common');
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
        if (!edu.degree || !edu.subject || !edu.school_name || !edu.start_year_month) {
            throw new Err('degree, subject, school_name and start_year_month are required', CODE.INVALID_PARAM);
        }
        if (edu.is_current !== 0 && edu.is_current !== 1) {
            throw new Err('is_current must be 0 or 1', CODE.INVALID_PARAM);
        }
        if (!isValidDate(edu.start_year_month)) {
            throw new Err('start_year_month format invalid: must be YYYY/MM', CODE.INVALID_PARAM);
        }
        if (edu.is_current === 0) {
            if (!edu.end_year_month) {
                throw new Err('end_year_month are required if is_current is false', CODE.INVALID_PARAM);
            }
            if (!isValidDate(edu.end_year_month)) {
                throw new Err('end_year_month format invalid: must be YYYY/MM', CODE.INVALID_PARAM);
            }
            if (new Date(edu.start_year_month) > new Date(edu.end_year_month)) {
                throw new Err('start_year_month must before end_year_month', CODE.INVALID_PARAM);
            }
        }

        // Step 1: Insert education into database
        const dbEducationId = await educationRepo.create({
            degree: edu.degree,
            subject: edu.subject,
            schoolName: edu.school_name,
            description: edu.description ?? '',
            startYearMonth: edu.start_year_month,
            endYearMonth: edu.is_current === 0 ? edu.end_year_month : null,
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
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }
        if (!edu.degree || !edu.subject || !edu.school_name || !edu.start_year_month) {
            throw new Err('degree, subject, school_name and start_year_month are required', CODE.INVALID_PARAM);
        }
        if (edu.is_current !== 0 && edu.is_current !== 1) {
            throw new Err('is_current must be 0 or 1', CODE.INVALID_PARAM);
        }
        if (!isValidDate(edu.start_year_month)) {
            throw new Err('start_year_month format invalid: must be YYYY/MM', CODE.INVALID_PARAM);
        }
        if (edu.is_current === 0) {
            if (!edu.end_year_month) {
                throw new Err('end_year_month are required if is_current is false', CODE.INVALID_PARAM);
            }
            if (!isValidDate(edu.end_year_month)) {
                throw new Err('end_year_month format invalid: must be YYYY/MM', CODE.INVALID_PARAM);
            }
            if (new Date(edu.start_year_month) > new Date(edu.end_year_month)) {
                throw new Err('start_year_month must before end_year_month', CODE.INVALID_PARAM);
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
            startYearMonth: edu.start_year_month,
            endYearMonth: edu.is_current === 0 ? edu.end_year_month : null,
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