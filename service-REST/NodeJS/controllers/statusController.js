// controllers/statusController.js

const statusService = require('../services/statusService');
const logger = require('../middleware/logger');

// Контролер для обробки логіки перевірки статусу сервісу
exports.getStatus = async (req, res, next) => {
    try {
          // Отримання статусу бази даних
          const dbStatus = await statusService.getDbStatus();

          // Визначення статусу сервісу на основі статусу бази даних
          const serviceStatus = dbStatus.database === 'connected' ? 'OK' : 'fail';
          
          if (serviceStatus === 'fail') {
              // Логування та відправка відповіді при помилці
              logger.error(`Server status: ${JSON.stringify(serviceStatus)}. Details: ${JSON.stringify(dbStatus)}`);
              res.status(500).json({ status:serviceStatus, details: dbStatus });
          } else {
              // Логування та відправка відповіді при успішній перевірці
              logger.info(`Server status: ${JSON.stringify(serviceStatus)}. Details: ${JSON.stringify(dbStatus)}`);
              res.status(200).json({ status:serviceStatus, details: dbStatus });
          }
      } catch (error) {
          // Логування та передача помилки до наступного middleware
          logger.error('Error while attempting to check server status', error);
          next(error);
      }
  };
  
