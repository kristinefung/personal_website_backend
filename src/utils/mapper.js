module.exports = {
    apiStatusMapper: (status) => {
        const statusCodes = new Map([
            ["0", "SUCCESS"],
            // Unexpected error
            ["99", "UNKOWN_ERROR"],
            // Common error
            ["10", "INVALID_PARAM"],
            ["11", "INVALID_TOKEN"],
            ["12", "RECORD_NOT_EXISTED"],
            // User related
            ["20", "USER_EXISTED"],
            ["21", "INCORRECT_CREDENTIAL"],
            ["22", "USER_NOT_VERIFIED"],
            ["23", "INVALID_USER"],
        ]);

        return statusCodes.get(status + "");
    }
}