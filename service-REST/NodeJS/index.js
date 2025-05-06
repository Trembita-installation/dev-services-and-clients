require('dotenv').config() // Імпортувати бібліотеку для роботи з змінними середовища
const http = require('http') // Імпортувати модуль HTTP з Node.js для створення сервера
const app = require('./app') // Імпортувати налаштований Express додаток з файлу app.js
const logger = require('./middleware/logger') // Імпортувати логер для ведення журналу запитів

logger.level = process.env.LOG_LEVEL || 'debug' // Встановити рівень логування змінної середовища LOG_LEVEL або за замовчуванням встановити debug
logger.info(`logger level ${process.env.LOG_LEVEL}`) // Логувати встановлений рівень
const port = process.env.PORT || 3000 // Встановити порт сервера зі змінної середовища PORT або за замовчуванням 3000
const hostname = process.env.HOST || '0.0.0.0'

const server = http.createServer(app) // Створити HTTP сервер на базі Express додатку

// Запустити сервер на вказаному порту
server.listen(port, hostname, () => {
	logger.info(`Server running at http://${hostname}:${port}/`) // Логувати повідомлення про запуск сервера на певному порту
})
