const { STATUS_CODES } = require('../config/constants')
module.exports = class BaseError extends Error {
    code = STATUS_CODES.Default;
    constructor(message, errCode = STATUS_CODES.Default) {
        super(message);
        this.code = errCode;
    }

    toJSON() {
        return {
            errorMessage: this.message,
            errorCode: this.code
        }
    }
}