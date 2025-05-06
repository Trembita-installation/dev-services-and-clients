// routes/status.js

const express = require('express')
const router = express.Router()
const statusController = require('../controllers/statusController')
const logger = require('../middleware/logger');


// Обробка GET-запиту для перевірки статусу сервісу
router.get('/', (req, res, next) => {
	// #swagger.summary = 'Check Service Status'
	// #swagger.tags = ['Service Status']
	// #swagger.description = 'Route to check the service status.'
	// #swagger.responses[500] = { description: 'Internal Server Error' }
	logger.info('Attempt to status check')
	statusController.getStatus(req, res, next) 
})

module.exports = router
