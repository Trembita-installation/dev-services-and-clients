import axios from 'axios' // Імпорт бібліотеки axios для виконання запитів
import https from 'https' // Імпорт модулю https для налаштування HTTPS
import fs from 'fs' // Імпорт модулю fs для роботи з файловою системою

let axiosInstance // Змінна для зберігання екземпляру Axios

if (process.env.PROTOCOL === 'https') {
	const certPath = './certs/cert.pem' // Шлях до сертифікату
	const keyPath = './certs/key.pem' // Шлях до ключа
	const caPath = './certs/service-cert.pem' // Шлях до сертифіката сервісу

	const cert = fs.readFileSync(certPath) // Зчитування сертифікату
	const key = fs.readFileSync(keyPath) // Зчитування ключа
	const ca = fs.readFileSync(caPath) // Зчитування сертифіката сервісу

	// Створення екземпляру Axios з передачею сертифіката та ключа
	axiosInstance = axios.create({
		httpsAgent: new https.Agent({
			cert: cert, // Передача сертифікату
			key: key, // Передача ключа
			ca: ca, // Передача сертифіката сервісу
			rejectUnauthorized: false // Вимкнення перевірки сертифіката 
		}),
		baseURL: `${process.env.PROTOCOL}://${process.env.SECURITY_SERVER_IP}`, // Базовий URL для всіх запитів
		validateStatus: function (status) {
			return status < 501 // Валідація статусу відповіді: успішність, якщо статус менше 501
		}
	})
} else {
	// Створення екземпляру Axios без використання сертифікатів
	axiosInstance = axios.create({
		baseURL: `${process.env.PROTOCOL}://${process.env.SECURITY_SERVER_IP}`, // Базовий URL для всіх запитів
		validateStatus: function (status) {
			return status < 501 // Валідація статусу відповіді: успішність, якщо статус менше 501
		}
	})
}

export default axiosInstance // Експорт створеного екземпляру Axios
