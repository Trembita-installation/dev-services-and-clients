import axios from 'axios';

// Створення екземпляру axios з налаштуванням базового URL і відключенням валідації статусу
const axiosInstance = axios.create({
  baseURL: '/api', // Базовий URL для всіх запитів, які будуть відправлені через цей екземпляр
  validateStatus: false // Відключення автоматичної валідації статусу відповіді (дозволяє обробляти будь-які статуси)
});

export default axiosInstance;
