const morgan = require('morgan'); // Підключення бібліотеки morgan для логування HTTP-запитів
const logger = require('./logger'); // Підключення модулю logger для налаштування логування

// Створення об'єкту stream з функцією 'write', яка буде використовуватися Morgan
const stream = {
  write: (message) => logger.info(message.trim()) // Функція, яка передає повідомлення до logger у форматі info
};

// Створення Morgan middleware з налаштуванням 'combined' і використанням створеного stream
const morganMiddleware = morgan('combined', { stream });

module.exports = morganMiddleware; // Експорт створеного middleware для логування HTTP-запитів

