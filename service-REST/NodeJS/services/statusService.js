// services/statusService.js

const models = require('../models/index');

// Сервіс для перевірки статусу бази даних
exports.getDbStatus = async () => {
    try {
        // Спроба аутентифікації до бази даних
        await models.sequelize.authenticate();
        return { database: 'connected' };
    } catch (error) {
        // Повернення статусу та повідомлення про помилку у разі невдачі
        return { database: 'disconnected', error: error.message };
    }
};