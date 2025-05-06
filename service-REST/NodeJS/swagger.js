// Імпортуємо swagger-autogen з конфігурацією для OpenAPI 3.0.0
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })


// Визначаємо документацію для API
const doc = {
	info: {
		title: 'rest-sync-service-node-express-js',
		description: 'This Node.js Express server allows you to manage a list of people. It provides endpoints to perform CRUD operations on person records stored in the database. The server uses Sequelize as an ORM to interact with the database and has features such as input validation, logging, and error handling.'// Опис сервісу
	},
	host: ''
	
}
// Вказуємо шлях до файлу, куди буде згенеровано документацію
const outputFile = './swagger-output.json'
// Вказуємо маршрути, які потрібно включити в документацію
const routes = ['./app.js']

// Генеруємо документацію за допомогою swagger-autogen
swaggerAutogen(outputFile, routes, doc)
