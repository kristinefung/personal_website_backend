const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: './logs/log.txt',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true,
        }),
    ],
});

module.exports = { logger };