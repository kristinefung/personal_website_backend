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
    createEducation: async (education) => {
        // Step 0: Data validation
        if (!education.degree || !education.subject || !education.school_name || !education.start_date_month || !education.start_date_year || !education.is_current === '') {
            throw new Err('degree, subject, school_name, start_date_month, start_date_year and is_current are required', CODE.INVALID_PARAM);
        }
        if (education.is_current === 0) {
            if (!education.end_date_month || !education.end_date_year) {
                throw new Err('end_date_month and end_date_year are required if is_current is false', CODE.INVALID_PARAM);
            }
        }

        // Step 1: Insert education into database
        const dbEducationId = await educationRepo.create({
            degree: education.degree,
            subject: education.subject,
            schoolName: education.school_name,
            description: education.description ?? '',
            startDateMonth: education.start_date_month,
            startDateYear: education.start_date_year,
            endDateMonth: education.end_date_month,
            endDateYear: education.end_date_year,
            isCurrent: education.is_current
        })
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot create education from database', CODE.DATABASE_ERROR);
            });

        return education;
    },
    updateEducationById: async (id, education) => {
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

        // Step 2: Update education
        const changedRows = await educationRepo.updateById({
            id: id,
            degree: education.degree,
            subject: education.subject,
            schoolName: education.school_name,
            description: education.description,
            startDateMonth: education.start_date_month,
            startDateYear: education.start_date_year,
            endDateMonth: education.end_date_month,
            endDateYear: education.end_date_year,
            isCurrent: education.is_current
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