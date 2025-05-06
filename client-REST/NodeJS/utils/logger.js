const winston = require('winston') // Підключення бібліотеки winston для збору та обробки логів
const path = require('path') // Підключення модулю path для роботи з шляхами до файлів
const fs = require('fs') // Підключення модулю fs для роботи з файловою системою Node.js

const logDirectory = process.env.LOG_DIRECTORY

// Визначення конфігурації користувацького логера
let logger
if (logDirectory) {
	// Перевірка наявності директорії логів; якщо вона не існує, вона створюється
	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory)
	}
	// Конфігурація логгера для запису логів в файл
	logger = winston.createLogger({
		level: process.env.LOG_LEVEL || 'info', // Рівень логування за замовчуванням (інформаційний)
		format: winston.format.combine(
			winston.format.timestamp(), // Додавання в лог таймстемпу
			winston.format.printf(
				info => `${info.timestamp} ${info.level}: ${info.message}` // Формат виведення повідомлення
			)
		),
		transports: [
			// new winston.transports.Console(), // Виведення логів в консоль
			new winston.transports.File({
				filename: path.join(
					logDirectory,
					process.env.ERROR_LOG_FILE_NAME || 'error.log' // Файл для збереження помилок
				),
				level: 'error' // Логування тільки помилок
			}),
			new winston.transports.File({
				filename: path.join(
					logDirectory,
					process.env.COMBINED_LOG_FILE_NAME || 'combined.log' // Файл для збереження комбінованих логів
				)
			})
		]
	})
} else {
	// Конфігурація логгера для вивеення логів в консоль
	logger = winston.createLogger({
		level: process.env.LOG_LEVEL || 'info', // Рівень логування за замовчуванням (інформаційний)
		format: winston.format.combine(
			winston.format.timestamp(), // Додавання в лог таймстемпу
			winston.format.printf(
				info => `${info.timestamp} ${info.level}: ${info.message}` // Формат виведення повідомлення
			)
		),
		transports: [
			new winston.transports.Console() // Виведення логів в консоль
		]
	})
}

module.exports = logger // Експорт створеного екземпляру логгера
