const logger = require('../middleware/logger') // Імпортуємо логер для логування за допомогою Winston
const personService = require('../services/personService') // Імпортуємо personService для обробки CRUD операцій з особами

// Функції контролера:

// Обробляє створення нової особи. Делегує операцію створення функції personService.createPerson().
// Повертає новостворену особу зі статусом 201, якщо успішно. В разі неможливості обробки запиту через конфлікти унікальності записів  повертає відповідь з помилкою зі статусом 409.
exports.createPerson = async (req, res, next) => {
	try {
		const {
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		} = req.body
		const newPerson = await personService.createPerson({
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		})
		logger.info(`Person created: ${JSON.stringify(newPerson)}`)
		res.status(201).json(newPerson)
	} catch (error) {
		// Обробка для SequelizeUniqueConstraintError, який є типом помилки, що виникає, коли унікальне обмеження в базі даних порушується.
		if (error.name === 'SequelizeUniqueConstraintError') {
			const errorMessage = error.errors.map(err => err.message).join('; ')
			logger.error(
				`DB Unique Constraint Error while attempt to create person: ${errorMessage}`
			)
			res.status(409).json(`Помилка унікальності. ${errorMessage}`) // Відправлення фактичного повідомлення про помилку клієнту
		} else {
			logger.error(`Error while attempt to create person`)
			next(error)
		}
	}
}

// Обробляє отримання осіб за параметрами запиту. Делегує операцію функції personService.getPersons().
// Повертає список осіб зі статусом 200, якщо успішно.
// В разі відсутності записів в БД повертає відповідь з помилкою зі статусом 404.
exports.getPersons = async (req, res, next) => {
	try {
		const {
			_page = 1,
			_limit = 10,
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		} = req.query
		const queryParameters = {
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		}
		const filteredQueryParameters = Object.fromEntries(
			Object.entries(queryParameters).filter(
				([key, value]) => value !== undefined
			)
		)
		const offset = (_page - 1) * _limit
		const limit = parseInt(_limit)

		// Отримання загальної кількості записів
		const totalCount = await personService.getPersonsCount(
			filteredQueryParameters
		)
		logger.info(
			`Number of persons in DB that match parameters:${JSON.stringify(
				filteredQueryParameters
			)} is equal ${totalCount}`
		)
		if (totalCount === 0) {
			return res.status(404).json(`Помилка пошуку. Не знайдено жодної особи`)
		}
		const persons = await personService.getPersons(
			filteredQueryParameters,
			offset,
			limit
		)
		logger.debug(
			`Retrieved ${persons.length} persons: ${JSON.stringify(persons)}`
		)
		res.status(200).json({ totalCount: totalCount, persons: persons })
	} catch (error) {
		logger.error(`Error while attempt to get persons`)
		next(error)
	}
}

// Обробляє оновлення осіб. Делегує операцію функції personService.updatePersons().
// Повертає відповідь зі статусом 200, якщо успішно, або відповідь 'Person not found' зі статусом 404, якщо особа не існує. В разі неможливості обробки запиту через конфлікти унікальності записів  повертає відповідь з помилкою зі статусом 409.
exports.updatePersons = async (req, res, next) => {
	try {
		const {
			attribute,
			value,
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		} = req.body
		const bodyParameters = {
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		}
		const filteredBodyParameters = Object.fromEntries(
			Object.entries(bodyParameters).filter(([key, value]) => value !== '')
		)

		const updatedRowsCount = await personService.updatePersons(
			attribute,
			value,
			filteredBodyParameters
		)
		if (updatedRowsCount == 0) {
			logger.info(`Update failed. No Person found by (${attribute}): ${value}`)
			return res
				.status(404)
				.json(
					`Помилка оновлення. Жодної особи за критерієм ${attribute}: ${value} не знайдено`
				)
		}
		logger.info(`Updated ${updatedRowsCount} person by ${attribute}: ${value}.`)
		res
			.status(200)
			.json(
				`Успішно оновлено осіб - ${updatedRowsCount} за критерієм ${attribute}: ${value}.`
			)
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			const errorMessage = error.errors.map(err => err.message).join('; ')
			logger.error(
				`DB Unique Constraint Error while attempt to update person: ${errorMessage}`
			)
			res.status(409).json(`Помилка унікальності. ${errorMessage}`)
		} else {
			logger.error(`Error while attempt to update persons`)
			next(error)
		}
	}
}

// Обробляє видалення осіб. Делегує операцію функції personService.deletePersons().
// Повертає відповідь зі статусом 200, якщо успішно, або відповідь 'Person not found' зі статусом 404, якщо особа не існує.
exports.deletePersons = async (req, res, next) => {
	try {
		const { attribute, value } = req.query
		const deletedPersonsCount = await personService.deletePersons(
			attribute,
			value
		)
		if (deletedPersonsCount === 0) {
			logger.info(`Delete failed. No Person found by (${attribute}): ${value}`)
			return res
				.status(404)
				.json(
					`Помилка видалення. Жодної особи за критерієм ${attribute}: ${value} не знайдено`
				)
		}
		logger.info(
			`Deleted ${deletedPersonsCount} person by ${attribute}: ${value}.`
		)
		res
			.status(200)
			.json(
				`Успішно видалено осіб - ${deletedPersonsCount} за критерієм ${attribute}: ${value}.`
			)
	} catch (error) {
		logger.error(`Error while attempt to delete persons`)
		next(error)
	}
}

//Обробка помилок реалізована за допомогою блоків try-catch для перехоплення можливих помилок, які можуть виникнути під час операцій з базою даних. Помилки логуються за допомогою логера, а відповідні відповіді з помилками надсилаються клієнту.

// Файл personController.js ефективно обробляє CRUD операції для осіб, делегує операції сервісу personService і виконує обробку помилок за допомогою блоків try-catch. Він має чисту та організовану структуру, що добре для підтримуваності.
