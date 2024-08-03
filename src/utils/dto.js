const { CODE } = require('./mapper');

module.exports = {
    dataToResp: (status = 99, message, data) => {
        let statusCode = "";
        for (var i in CODE) {
            if (CODE[i] == status) {
                statusCode = i;
            }
        }
        return {
            status: status,
            status_code: statusCode,
            message: message,
            data: data
        };
    }
}