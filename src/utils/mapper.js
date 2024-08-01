module.exports = {
    CODE: {
        SUCCESS: 0,
        // Unexpected error
        UNKNOWN_ERROR: 99,
        // Common error
        DATABASE_ERROR: 10,
        INVALID_PARAM: 11,
        INVALID_TOKEN: 12,
        // User related
        USER_EXISTED: 20,
        USER_NOT_EXISTED: 21,
        INCORRECT_CREDENTIAL: 22,
        USER_NOT_VERIFIED: 23,
        INVALID_USER: 24,
    },
    ROLE: {
        ADMIN: 1,
        USER: 2,
    },
    USER_STATUS: {
        ACTIVE: 1,
        NOT_VERIFIED: 2,
        INACTIVE: 3
    }
}