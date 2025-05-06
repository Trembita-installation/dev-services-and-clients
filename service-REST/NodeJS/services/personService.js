const logger = require('../middleware/logger') // Логер: Імпортується для логування за допомогою Winston.
const models = require('../models/index') // Моделі: Імпортуються для доступу до моделей Sequelize для взаємодії з базою даних.

// У Sequelize, коли ви викликаєте метод create() для моделі (у цьому випадку, моделі Person), Sequelize генерує та виконує запит SQL INSERT, щоб вставити новий запис у відповідну таблицю бази даних.

// Створює новий запис особи в базі даних за допомогою моделі Person. Отримує дані особи як параметри та вставляє їх у базу даних за допомогою методу create() Sequelize.
exports.createPerson = async personData => {
	try {
		//Sequelize використовує параметризовані запити для взаємодії з базою даних, що відокремлює логіку SQL від даних. Це надійний захист від атак SQL-ін’єкцій.
		const newPerson = await models.Person.create(personData)
		//Наведений вище код гарантує, що person.name та інші вхідні дані розглядаються як дані, а не як виконуваний SQL.
		return newPerson
	} catch (error) {
		throw error
	}
}
// Отримує кількість осіб в базі даних на основі параметрів запиту.
exports.getPersonsCount = async queryParameters => {
	try {
		const totalCount = await models.Person.count({ where: queryParameters })
		return totalCount
	} catch (error) {
		throw error
	}
}
// Отримує осіб з бази даних на основі параметрів запиту. Створює запит Sequelize за допомогою наданих параметрів і повертає відповідних осіб.
exports.getPersons = async (queryParameters, offset, limit) => {
	try {
		const persons = await models.Person.findAll({
			where: queryParameters,
			offset,
			limit
		})
		return persons
	} catch (error) {
		throw error
	}
}
// Оновлює особу в базі даних на основі унікального атрибуту. Створює where clause на основі атрибуту та значення, оновлює дані осіб наданими новими даними і повертає кількість оновлених рядків .
exports.updatePersons = async (attribute, value, updateData) => {
	try {
		const updatedRowsCount = await models.Person.update(updateData, {
			where: { [attribute]: value }
		})
		return updatedRowsCount
	} catch (error) {
		throw error
	}
}

// Видаляє особу з бази даних на основі унікального атрибуту. Створює where clause на основі атрибуту та значення і видаляє відповідних осіб з бази даних і повертає кількість видалених осіб.
exports.deletePersons = async (attribute, value) => {
	try {
		const deletedPersonsCount = await models.Person.destroy({
			where: { [attribute]: value }
		})
		return deletedPersonsCount
	} catch (error) {
		throw error
	}
}

// Кожна функція сервісу обгортає свої операції з базою даних у блок try-catch для перехоплення можливих помилок. Якщо виникає помилка, вона викидає помилку для обробки викликачем.

// Файл personService.js ефективно інкапсулює бізнес-логіку для обробки CRUD операцій з особами, взаємодіє з базою даних за допомогою моделей Sequelize і виконує перехоплення помилок.
