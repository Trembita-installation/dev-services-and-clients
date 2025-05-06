const winston = require('winston')
const path = require('path')

// Отримання налаштувань логування з змінних середовища
const logLevel = process.env.LOG_LEVEL || 'info'
const logDirectory = process.env.LOG_DIRECTORY
const errorLogFileName = process.env.ERROR_LOG_FILE_NAME || 'error.log'
const combinedLogFileName = process.env.COMBINED_LOG_FILE_NAME || 'combined.log'

// Забезпечення існування каталогу для логів
const fs = require('fs')


// Визначення конфігурації користувацького логера
let logger
if(logDirectory){
	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory)
	}
	logger = winston.createLogger({
		level: logLevel,
		format: winston.format.combine(
			winston.format.timestamp(), // Додавання мітки часу
			winston.format.printf(
				info => `${info.timestamp} ${info.level}: ${info.message}`
			) // Визначення формату логів
		),
		transports: [
			// new winston.transports.Console(), // Log to the console
			new winston.transports.File({
				filename: path.join(logDirectory, errorLogFileName),
				level: 'error'
			}), // Логування помилок у файл
			new winston.transports.File({
				filename: path.join(logDirectory, combinedLogFileName)
			}) // Логування всіх рівнів у загальний файл
		]
	})
} else {
	logger = winston.createLogger({
		level: logLevel,
		format: winston.format.combine(
			winston.format.timestamp(), // Додавання мітки часу
			winston.format.printf(
				info => `${info.timestamp} ${info.level}: ${info.message}`
			) // Визначення формату логів
		),
		transports: [
			new winston.transports.Console(), // Log to the console
		]
	})

}

module.exports = logger
