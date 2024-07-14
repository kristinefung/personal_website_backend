module.exports = {
    apiStatusMapper: (status) => {
        const statusCodes = new Map([
            ["0", "SUCCESS"],
            // Unexpected error
            ["99", "UNKOWN_ERROR"],
            // Common error
            ["10", "INVALID_PARAM"],
            // User related
            ["20", "USER_EXISTED"],
            ["21", "INCORRECT_CREDENTIAL"]
        ]);

        var statusCode = statusCodes.get(status + "");
        return statusCode;
    }
}