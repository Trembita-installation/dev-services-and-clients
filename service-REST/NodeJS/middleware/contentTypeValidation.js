// middleware/contentTypeValidation.js
const logger = require('../middleware/logger') // Імпортуємо логер Winston

function validateContentType(req, res, next) {
	const contentType = req.headers['content-type']

	// Перевіряємо, що тип контенту відповідає очікуваному (наприклад application/json)
	if (!contentType || !contentType.includes('application/json')) {
		logger.warn(
			`Validation error: Unsupported Media Type ${contentType}! Only application/json supported.`
		)
		return res
			.status(415)
			.send(
				`Помилка валідації: Тип медіа не підтримується ${contentType}! Підтримується лише application/json.`
			)
	}

	next()
}

module.exports = validateContentType
