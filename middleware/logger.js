const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'logs', 'server.log');

module.exports = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const ms = Date.now() - start;
        const logMessage = `${req.method} ${req.url} -> ${res.statusCode} (${ms}ms)`;
        console.log(logMessage);

        fs.appendFile(logFile, logMessage + '\n', (err) => {
            if (err) console.error('Failed to write to log file:', err);
        });
    });
    next();
};

