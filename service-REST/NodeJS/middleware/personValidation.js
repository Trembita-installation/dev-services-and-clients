const { check, body, query } = require('express-validator') // Імпорт функції check з модуля express-validator для створення правил валідації

// Middleware валідації для маршруту createPerson

//express-validator — це проміжне програмне забезпечення для перевірки та очищення введених користувачем даних. Це допомагає гарантувати, що дані, які надходять на сервер, чисті та відповідають заданим критеріям.

//Ось як це сприяє безпеці:

//Перевірка: гарантує, що вхідні дані знаходяться в очікуваному форматі та в межах заданих обмежень. За допомогою  check()
//Дезінфекція: дезінфікує inputs, щоб видалити будь-який потенційно шкідливий вміст.  - .trim().escape()
//Метод .trim() видаляє пробіли з обох кінців рядка.
//Метод .escape() замінює <, >, &, ', " та / відповідними об'єктами HTML. Це корисно для запобігання атакам XSS, гарантуючи, що введені користувачем дані розглядаються як звичайний текст, а не як виконуваний HTML або JavaScript.

exports.createPerson = [
	body('name') // Валідація поля "name"
		.isLength({ min: 1, max: 50 }) // Перевірка довжини поля "name" від 1 до 50 символів
		.withMessage('Name must be between 1 and 50 characters') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('surname') // Валідація поля "surname"
		.isLength({ min: 1, max: 50 }) // Перевірка довжини поля "surname" від 1 до 50 символів
		.withMessage('Surname must be between 1 and 50 characters') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('patronym') // Валідація поля "patronym"
		.optional() // Поле "patronym" є необов'язковим
		.if(value => value !== '') // Застосовувати перевірку довжини лише якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Перевірка довжини поля "patronym" не більше 50 символів, якщо воно присутнє
		.withMessage('Patronym must be less than 50 characters') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('dateOfBirth') // Валідація поля "dateOfBirth"
		.isDate({ format: 'YYYY-MM-DD' }) // Перевірка, що "dateOfBirth" є датою у форматі 'YYYY-MM-DD'
		.withMessage('Date of birth must be a valid date in YYYY-MM-DD format') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('rnokpp') // Валідація поля "rnokpp"
		.isLength({ min: 10, max: 10 }) // Перевірка довжини поля "rnokpp" - 10 символів
		.withMessage('RNOKPP must be 10 digits. Format: xxxxxxxxxx') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('unzr') // Валідація поля "unzr"
		.isLength({ min: 14, max: 14 }) // Перевірка довжини поля "unzr" - 14 символів
		.withMessage('UNZR must be 14 characters long. Format: xxxxxxxx-xxxxx') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('passportNumber') // Валідація поля "passportNumber"
		.isLength({ min: 9, max: 9 }) // Перевірка довжини поля "passportNumber" - 9 символів
		.withMessage('Passport number must be 9 digits. Format: xxxxxxxxx') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('gender') // Валідація поля "gender"
		.isIn(['male', 'female']) // Перевірка, що значення поля "gender" є "male" або "female"
		.withMessage('gender must be either "male" or "female"') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape() // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
]

// Middleware валідації для маршруту getPersons
exports.getPersons = [
	query('id') // Перевірка "id"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Довжина від 1 до 50 символів
		.withMessage('ID must be between 1 and 50 characters') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('name') // Перевірка "name"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Довжина від 1 до 50 символів
		.withMessage('Name must be between 1 and 50 characters') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('surname') // Перевірка "surname"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Довжина від 1 до 50 символів
		.withMessage('Surname must be between 1 and 50 characters') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('patronym') // Перевірка "patronym"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isLength({ min: 0, max: 50 }) // Довжина не більше 50 символів
		.withMessage('Patronym must be less than 50 characters') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('dateOfBirth') // Перевірка "dateOfBirth"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isDate({ format: 'YYYY-MM-DD' }) // Дата у форматі 'YYYY-MM-DD'
		.withMessage('Date of birth must be a valid date in YYYY-MM-DD format') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('rnokpp') // Перевірка "rnokpp"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isLength({ min: 10, max: 10 }) // Довжина 10 символів
		.withMessage('RNOKPP must be 10 digits. Format: xxxxxxxxxx') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('unzr') // Перевірка "unzr"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isLength({ min: 14, max: 14 }) // Довжина 14 символів
		.withMessage('UNZR must be 14 characters long. Format: xxxxxxxx-xxxxx') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('passportNumber') // Перевірка "passportNumber"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isLength({ min: 9, max: 9 }) // Довжина 9 символів
		.withMessage('Passport number must be 9 digits. Format: xxxxxxxxx') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('gender') // Перевірка "gender"
		.optional() // Необов'язкове поле
		.if(value => value !== '') // Застосувати перевірку, якщо значення не є порожнім рядком
		.isIn(['male', 'female']) // Має бути "male" або "female"
		.withMessage('gender must be either "male" or "female"') // Повідомлення про помилку
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape() // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
]

// Middleware валідації для маршруту updatePersons
exports.updatePersons = [
	body('attribute') // Перевірка "attribute"
		.isIn([
			'id',
			'name',
			'surname',
			'patronym',
			'dateOfBirth',
			'rnokpp',
			'unzr',
			'passportNumber',
			'gender'
		]) // Перевірка, що "attribute" містить допустимі значення
		.withMessage(
			'attribute must be either name, surname, patronym, dateOfBirth, rnokpp, unzr, passportNumber, gender or id'
		) // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('value') // Перевірка "value"
		.optional() // Поле "value" є необов'язковим
		.if(value => value !== '') // Застосувати перевірку довжини лише якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Перевірка довжини поля "value" від 1 до 50 символів
		.withMessage('value must be between 1 and 50 characters') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('name') // Перевірка "name"
		.optional() // Поле "name" є необов'язковим
		.if(value => value !== '') // Застосувати перевірку довжини лише якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Перевірка довжини поля "name" від 1 до 50 символів
		.withMessage('Name must be between 1 and 50 characters') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('surname') // Перевірка "surname"
		.optional() // Поле "surname" є необов'язковим
		.if(value => value !== '') // Застосувати перевірку довжини лише якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Перевірка довжини поля "surname" від 1 до 50 символів
		.withMessage('Surname must be between 1 and 50 characters') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('patronym') // Перевірка "patronym"
		.optional() // Поле "patronym" є необов'язковим
		.if(value => value !== '') // Застосувати перевірку довжини лише якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Перевірка довжини поля "patronym" від 1 до 50 символів
		.withMessage('Patronym must be less than 50 characters') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('dateOfBirth') // Перевірка "dateOfBirth"
		.optional() // Поле "dateOfBirth" є необов'язковим
		.if(value => value !== '') // Застосувати перевірку лише якщо значення не є порожнім рядком
		.isDate({ format: 'YYYY-MM-DD' }) // Перевірка, що "dateOfBirth" є датою у форматі 'YYYY-MM-DD'
		.withMessage('Date of birth must be a valid date in YYYY-MM-DD format') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('rnokpp') // Перевірка "rnokpp"
		.optional() // Поле "rnokpp" є необов'язковим
		.if(value => value !== '') // Застосувати перевірку лише якщо значення не є порожнім рядком
		.isLength({ min: 10, max: 10 }) // Перевірка довжини поля "rnokpp" - 10 символів
		.withMessage('RNOKPP must be 10 digits. Format: xxxxxxxxxx') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('unzr') // Перевірка "unzr"
		.optional() // Поле  є необов'язковим
		.if(value => value !== '') // Застосувати перевірку лише якщо значення не є порожнім рядком
		.isLength({ min: 14, max: 14 }) // Перевіряє, що довжина поля "unzr" дорівнює 14 символів
		.withMessage('UNZR must be 14 characters long. Format: xxxxxxxx-xxxxx') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('passportNumber') // Перевірка "passportNumber"
		.optional() // Поле є необов'язковим
		.if(value => value !== '') // Застосувати перевірку лише якщо значення не є порожнім рядком
		.isLength({ min: 9, max: 9 }) // Перевіряє, що довжина поля "passportNumber" дорівнює 9 символів
		.withMessage('Passport number must be 9 digits. Format: xxxxxxxxx') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	body('gender') // Перевірка "gender"
		.optional() // Поле є необов'язковим
		.if(value => value !== '') // Застосувати перевірку лише якщо значення не є порожнім рядком
		.isIn(['male', 'female']) // Перевіряє, що значення поля "gender" є або "male", або "female"
		.withMessage('gender must be either "male" or "female"') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape() // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
]

// Middleware валідації для маршруту deletePersons
exports.deletePersons = [
	query('attribute') // Перевірка "attribute"
		.isIn([
			'id',
			'name',
			'surname',
			'patronym',
			'dateOfBirth',
			'rnokpp',
			'unzr',
			'passportNumber',
			'gender'
		]) // Перевірка, що "attribute" містить допустимі значення
		.withMessage(
			'attribute must be either name, surname, patronym, dateOfBirth, rnokpp, unzr, passportNumber, gender or id'
		) // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape(), // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
	query('value') // Перевірка "value"
		.optional() // Поле "value" є необов'язковим
		.if(value => value !== '') // Застосувати перевірку довжини лише якщо значення не є порожнім рядком
		.isLength({ min: 1, max: 50 }) // Перевірка довжини поля "value" від 1 до 50 символів
		.withMessage('value must be between 1 and 50 characters') // Повідомлення про помилку, якщо умова не виконана
		.trim() // Видаляє пробіли з обох кінців рядка.
		.escape() // Замінює <, >, &, ', " та / відповідними об'єктами HTML.
]
