const express = require('express') // Імпортуємо фреймворк Express
const morgan = require('morgan') // Middleware для логування запитів HTTP
const logger = require('./middleware/logger') // Наш власний middleware для логування
const helmet = require('helmet') // Helmet для налаштування заголовків безпеки HTTP
const bodyParser = require('body-parser') // body-parser для аналізу JSON запитів
const router = express.Router() // Створення екземпляра маршрутизатора
const swaggerUi = require('swagger-ui-express') // Swagger UI для візуалізації API
const swaggerDocument = require('./swagger-output.json') // Шлях до сгенерованого JSON файлу Swagger
const app = express() // Створення екземпляра Express-додатку
const requestLogger = require('./middleware/requestLogger'); // Імпортуємо middleware для логування запитів
const responseLogger = require('./middleware/responseLogger'); // Імпортуємо middleware для логування відповідей


// Налаштування Middleware

// Використання middleware Helmet для налаштування різних заголовків безпеки HTTP
helmet({
	contentSecurityPolicy: {  // Налаштовуємо політику безпеки контенту. contentSecurityPolicy - цей заголовок відповідає, в тому числі, за можливість доступу до документації SWAGGER за зовнішньою адресою.
			directives: {  // Директиви політики безпеки
					defaultSrc: ["'self'"],  // За замовчуванням дозволяє завантажувати ресурси лише з поточного домену
					scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],  // Дозволяє виконувати скрипти лише з поточного домену, а також inline скрипти та виконання eval
					styleSrc: ["'self'", "'unsafe-inline'"],  // Дозволяє завантажувати стилі лише з поточного домену, а також inline стилі
					imgSrc: ["'self'", 'data:'],  // Дозволяє завантажувати зображення лише з поточного домену та дані в форматі base64
					connectSrc: ["'self'"], // Дозволяє встановлювати з'єднання тільки з поточного домену, localhost та WebSockets на localhost
					fontSrc: ["'self'", 'data:'],  // Дозволяє завантажувати шрифти лише з поточного домену та дані в форматі base64
					objectSrc: ["'none'"],  // Забороняє завантаження об'єктів, таких як Flash
					mediaSrc: ["'self'"],  // Дозволяє завантажувати медіаресурси лише з поточного домену
					frameSrc: ["'self'"]  // Дозволяє завантажувати фрейми лише з поточного домену
			}
	}
});

app.use(bodyParser.json()) // Використання middleware bodyParser для аналізу вхідних JSON запитів

// Налаштування Morgan для використання Winston для логування
app.use(
	morgan('combined', {
		stream: {
			write: message => logger.info(message.trim()) // Запис повідомлень логування за допомогою logger
		}
	})
)

// Підключаємо middleware для логування HTTP запитів та відповідей
app.use(requestLogger)
app.use(responseLogger)

// Middleware для перенаправлення з кореневого URL на /api-docs
app.use((req, res, next) => {
	if (req.path === '/') {
			res.redirect('/api-docs');
	} else {
			next();
	}
});

// Налаштування маршрутів

// Обслуговування Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)) // Обслуговування Swagger UI на шляху /api-docs
// Імпорт маршрутів
const personRouter = require('./routes/person') // Імпорт маршрутизатора для роботи з person
const statusRouter = require('./routes/status'); 

// Використання маршрутов
app.use('/person', personRouter) // Підключення маршрутизатора person для запитів до URL /person
app.use('/status', statusRouter); // Використання маршруту для перевірки статусу сервісу

// Middleware для обробки помилок
app.use((err, req, res, next) => {
	logger.error(`Error in app: ${err.message}`, { stack: err.stack }) // Логування стеку помилки
	res.status(500).send('Внутрішня помилка сервера') // Відправлення відповіді з кодом 500
})

module.exports = app // Експорт додатку Express

// middleware
// У контексті Node.js та Express, middleware функції мають доступ до об'єктів запиту (req) та відповіді (res),
// і можуть виконувати завдання такі як логування, автентифікація, аналіз даних, обробка помилок та інше.
