class Err extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

module.exports = {
    Err,
}