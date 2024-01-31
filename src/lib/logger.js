const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'customer.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json())
    }),
    new transports.File({
      filename: 'customer-error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json())
    })
  ]
});

function logFileOperation(operation, id, size) {
  logger.info(`${operation} file with ID ${id} (data directory size ${size} bytes)`);
}

module.exports = {
  logger,
  logFileOperation,
};
