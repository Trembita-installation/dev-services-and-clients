const express = require('express') // Імпортуємо модуль Express
const router = express.Router() // Створюємо екземпляр маршрутизатора
const personController = require('../controllers/personController') // Імпортуємо контролер для обробки операцій, пов'язаних з особами
const personValidation = require('../middleware/personValidation') // Middleware для валідації запитів: Імпортуємо для валідації запитів за допомогою Express Validator
const { validationResult } = require('express-validator') // Імпортуємо validationResult для обробки результатів валідації
const logger = require('../middleware/logger') // Імпортуємо логер Winston
const validateContentType = require('../middleware/contentTypeValidation')

// Цей файл маршрутизатора ефективно обробляє CRUD операції для осіб, делегує операції відповідним функціям контролера та виконує валідацію запитів за допомогою middleware.

/// Маршрут для створення нової особи
router.post(
	'/',
	validateContentType,
	personValidation.createPerson, // Використання middleware для валідації запиту
	(req, res, next) => {
		// #swagger.summary = 'create Person'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to create a new person. It uses request validation middleware to validate the request body. If there are validation errors, it logs them and returns a 422 status with the validation errors. Otherwise, it delegates the creation operation to the createPerson controller function.'
		// #swagger.responses[415] = { description: 'Unsupported Media Type! Only application/json supported.' }
		// #swagger.responses[500] = { description: 'Internal Server Error' }
		logger.info('Attempt to create person')
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const errorMessages = errors
				.array()
				.map(error => {
					return `Field: ${error.path}, Value: ${error.value}, Message: ${error.msg}`
				})
				.join(' | ')
			logger.warn(`Validation error: ${errorMessages}`)
			// Статус 422 надає більш точний опис проблеми, ніж статус 400, який використовується для загальних помилок у запиті.
			return res.status(422).json(`Помилки валідації: ${errorMessages}`) // Повернення помилок валідації
		}
		personController.createPerson(req, res, next) // Виклик функції контролера для створення особи
	}
)
// Маршрут для отримання списку осіб
router.get(
	'/',
	personValidation.getPersons, // Використання middleware для валідації запиту
	(req, res, next) => {
		// #swagger.summary = 'get Persons By Query Parameters'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to get a list of persons by query parameters.Example '/person?_page=1&_limit=50&name=Adam' It also uses request validation middleware to validate the request query. If there are validation errors, it logs them and returns a 422 status with the validation errors.  Delegates the operation to the getPersons controller function.'
		// #swagger.responses[500] = { description: 'Internal Server Error' }
		logger.info('Attempt to get persons') // Логування спроби отримання списку осіб
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const errorMessages = errors
				.array()
				.map(error => {
					return `Field: ${error.path}, Value: ${error.value}, Message: ${error.msg}`
				})
				.join(' | ')
			logger.warn(`Validation error: ${errorMessages}`)
			return res.status(422).json(`Помилки валідації: ${errorMessages}`) // Повернення помилок валідації
		}
		personController.getPersons(req, res, next) // Виклик функції контролера для отримання списку осіб
	}
)

// Маршрут для оновлення осіб
router.put(
	'/',
	validateContentType,
	personValidation.updatePersons, // Використання middleware для валідації запиту
	(req, res, next) => {
		// #swagger.summary = 'update Persons By Attribute'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to update persons by attribute. It also uses request validation middleware to validate the request body. If there are validation errors, it logs them and returns a 422 status with the validation errors. Otherwise, it delegates the update operation to the  updatePersons controller function.'
		// #swagger.responses[415] = { description: 'Unsupported Media Type! Only application/json supported.' }
		// #swagger.responses[500] = { description: 'Internal Server Error' }
		logger.info('Atempt to update persons') // Логування спроби оновлення особи
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const errorMessages = errors
				.array()
				.map(error => {
					return `Field: ${error.path}, Value: ${error.value}, Message: ${error.msg}`
				})
				.join(' | ')
			logger.warn(`Validation error: ${errorMessages}`)
			return res.status(422).json(`Помилки валідації: ${errorMessages}`) // Повернення помилок валідації
		}
		personController.updatePersons(req, res, next) // Виклик функції контролера для оновлення особіб за атрибутом
	}
)

// Маршрут для видалення осіб
router.delete(
	'/',
	personValidation.deletePersons, // Використання middleware для валідації запиту
	(req, res, next) => {
		// #swagger.summary = 'delete Persons By Attribute'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to delete persons by attribute. It also uses request validation middleware to validate the request query. If there are validation errors, it logs them and returns a 422 status with the validation errors. Otherwise, it delegates the operation to the deletePersons controller function.'
		// #swagger.responses[500] = { description: 'Internal Server Error' }
		logger.info(`Attempt to delete persons`) // Логування спроби видалення осіб
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const errorMessages = errors
				.array()
				.map(error => {
					return `Field: ${error.path}, Value: ${error.value}, Message: ${error.msg}`
				})
				.join(' | ')
			logger.warn(`Validation error: ${errorMessages}`)
			return res.status(422).json(`Помилки валідації: ${errorMessages}`) // Повернення помилок валідації
		}
		personController.deletePersons(req, res, next) // Виклик функції контролера для видалення осіб
	}
)

module.exports = router // Експортуємо маршрутизатор для використання в інших файлах
