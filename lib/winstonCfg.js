const appRoot = require('app-root-path');
const winston = require('winston');
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, json} = format;
// define the custom settings for each transport (file, console)
const timezonedTime = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Yakutsk',
        hour12: false
    });
};

const winstonOptions = {
    fileInfo: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 50,
        colorize: false,
        format: combine(
            timestamp({
                format: timezonedTime
            }),
            json()
        )
    },
    fileError: {
        level: 'error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 50,
        colorize: false,
        format: combine(
            timestamp({
                format: timezonedTime
            }),
            json()
        )
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
    transports: [
        new winston.transports.File(winstonOptions.fileInfo),
        new winston.transports.File(winstonOptions.fileError),
        new winston.transports.Console(winstonOptions.console)

    ],
    exceptionHandlers: [
        new transports.File({ filename: '/logs/exceptions.log' })
    ],
    exitOnError: false, // do not exit on handled exceptions
});
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
// use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;
