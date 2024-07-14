module.exports = {
    apiStatusMapper: (status) => {
        const statusCodes = new Map([
            ["0", "SUCCESS"],
            // Unexpected error
            ["99", "UNKOWN_ERROR"],
            // Common error
            ["10", "INVALID_PARAM"],
            ["11", "INVALID_TOKEN"],
            // User related
            ["20", "USER_EXISTED"],
            ["21", "INCORRECT_CREDENTIAL"],
            ["22", "USER_NOT_VERIFIED"],
            ["23", "INVALID_USER"],
        ]);

        var statusCode = statusCodes.get(status + "");
        return statusCode;
    }
}