const workRepo = require('../adapters/repositories/work.repository');

const { isValidDate } = require('../utils/common');
const { Err } = require('../utils/err');
const { CODE } = require('../utils/mapper');

module.exports = {
    getAllWorks: async () => {
        const works = await workRepo.getAll()
            .catch(err => {
                throw new Err('cannot get all works from database', CODE.DATABASE_ERROR);
            });

        return works;
    },
    getWorkById: async (workId) => {
        // Step 0: Data validation
        if (!workId) {
            throw new Err('workId is required', CODE.INVALID_PARAM);
        }

        const work = await workRepo.getById(workId)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get work by id from database', CODE.DATABASE_ERROR);
            });
        if (!work.id) {
            throw new Err('no work found', CODE.INVALID_PARAM);
        }

        return work;
    },
    createWork: async (work) => {
        // Step 0: Data validation
        if (!work.title || !work.company_name || !work.start_year_month || !work.is_current === '') {
            throw new Err('title, company_name, start_year_month and is_current are required', CODE.INVALID_PARAM);
        }
        if (work.is_current !== 0 && work.is_current !== 1) {
            throw new Err('is_current must be 0 or 1', CODE.INVALID_PARAM);
        }
        if (!isValidDate(work.start_year_month)) {
            throw new Err('start_year_month format invalid: must be YYYY/MM', CODE.INVALID_PARAM);
        }
        if (work.is_current === 0) {
            if (!work.end_year_month) {
                throw new Err('end_year_month are required if is_current is false', CODE.INVALID_PARAM);
            }
            if (!isValidDate(work.end_year_month)) {
                throw new Err('end_year_month format invalid: must be YYYY/MM', CODE.INVALID_PARAM);
            }
            if (new Date(work.start_year_month) > new Date(work.end_year_month)) {
                throw new Err('start_year_month must before end_year_month', CODE.INVALID_PARAM);
            }
        }

        // Step 1: Insert work into database
        const dbWorkId = await workRepo.create({
            title: work.title,
            companyName: work.company_name,
            description: work.description ?? '',
            startYearMonth: work.start_year_month,
            endYearMonth: work.is_current === 0 ? work.end_year_month : null,
            isCurrent: work.is_current
        })
            .catch(err => {
                console.log(err.message);
                throw new Err('cannot create work from database', CODE.DATABASE_ERROR);
            });

        return work;
    },
    updateWorkById: async (id, work) => {
        // Step 0: Data validation
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }
        if (!work.title || !work.company_name || !work.start_year_month || !work.is_current === '') {
            throw new Err('title, company_name, start_year_month and is_current are required', CODE.INVALID_PARAM);
        }
        if (work.is_current !== 0 && work.is_current !== 1) {
            throw new Err('is_current must be 0 or 1', CODE.INVALID_PARAM);
        }
        if (!isValidDate(work.start_year_month)) {
            throw new Err('start_year_month format invalid: must be YYYY/MM', CODE.INVALID_PARAM);
        }
        if (work.is_current === 0) {
            if (!work.end_year_month) {
                throw new Err('end_year_month are required if is_current is false', CODE.INVALID_PARAM);
            }
            if (!isValidDate(work.end_year_month)) {
                throw new Err('end_year_month format invalid: must be YYYY/MM', CODE.INVALID_PARAM);
            }
            if (new Date(work.start_year_month) > new Date(work.end_year_month)) {
                throw new Err('start_year_month must before end_year_month', CODE.INVALID_PARAM);
            }
        }

        // Step 1: Check work existed in database
        const dbWork = await workRepo.getById(id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get work by id from database', CODE.DATABASE_ERROR);
            });
        if (!dbWork.id) {
            throw new Err('no work found', CODE.INVALID_PARAM);
        }

        // Step 2: Update work
        const changedRows = await workRepo.updateById({
            id: id,
            title: work.title,
            companyName: work.company_name,
            description: work.description ?? '',
            startYearMonth: work.start_year_month,
            endYearMonth: work.is_current === 0 ? work.end_year_month : null,
            isCurrent: work.is_current
        })
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot update work from database', CODE.DATABASE_ERROR);
            });

        return changedRows;
    },
    deleteWorkById: async (id) => {
        // Step 0: Data validation
        if (!id) {
            throw new Err('id is required', CODE.INVALID_PARAM);
        }

        // Step 1: Check work existed in database
        const dbWork = await workRepo.getById(id)
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot get work by id from database', CODE.DATABASE_ERROR);
            });
        if (!dbWork.id) {
            throw new Err('no work found', CODE.INVALID_PARAM);
        }

        // Step 2: Delete work
        const changedRows = await workRepo.updateById({
            id: id,
            deleted: 1,
        })
            .catch(err => {
                logger.error(err.message);
                throw new Err('cannot update work from database', CODE.DATABASE_ERROR);
            });

        return changedRows;
    },

}