const { apiStatusMapper } = require('./mapper');

module.exports = {
    dataToResp: (status, message, data) => {
        return {
            status: status,
            status_code: apiStatusMapper(status),
            message: message,
            data: data
        };
    }
}