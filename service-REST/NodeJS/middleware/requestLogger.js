const logger = require('./logger') // Імпортуємо логер Winston

// Middleware для логування HTTP запитів
const requestLogger = (req, res, next) => {
	logger.info(`[${req.method} ${req.url}]`) // Логування методу та URL запиту
	logger.debug(`Headers: ${JSON.stringify(req.headers)}`) // Логування заголовків запиту
	logger.debug(`Body: ${JSON.stringify(req.body)}`) // Логування тіла запиту
	next() // Передача управління наступному middleware
}

module.exports = requestLogger
