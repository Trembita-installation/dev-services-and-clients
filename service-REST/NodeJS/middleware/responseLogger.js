const logger = require('./logger') // Імпортуємо логер Winston

// Middleware для логування відповідей
const responseLogger = (req, res, next) => {
	const oldWrite = res.write
	const oldEnd = res.end
	const chunks = []

	res.write = (...restArgs) => {
		chunks.push(Buffer.from(restArgs[0]))
		oldWrite.apply(res, restArgs)
	}

	res.end = (...restArgs) => {
		if (restArgs[0]) {
			chunks.push(Buffer.from(restArgs[0]))
		}
		const body = Buffer.concat(chunks).toString('utf8')
		logger.debug(
			`Response for ${req.method} ${req.url}: Status ${
				res.statusCode
			}, Headers: ${JSON.stringify(res.getHeaders())}, Body: ${body}`
		)
		oldEnd.apply(res, restArgs)
	}

	next() // Передача управління наступному middleware
}

module.exports = responseLogger
