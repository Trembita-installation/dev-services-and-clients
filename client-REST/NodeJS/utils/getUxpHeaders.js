// Імпортуємо функцію генерації унікального ідентифікатора з бібліотеки uuid
import { v4 as uuidv4 } from 'uuid'

// Функція для отримання заголовків запиту
export const getUxpHeaders = () => {
	// Створюємо об'єкт заголовків запиту
	const uxpHeaders = {
		'Purpose-Id': `${process.env.PURPOSE_ID}`, // Заголовок Purpose-Id, зчитаний з оточення
		'Uxp-Client': `${process.env.INSTANCE_NAME}/${process.env.CLIENT_MEMBER_CLASS}/${process.env.CLIENT_MEMBER_CODE}/${process.env.CLIENT_SUBSYSTEM}`, // Заголовок Uxp-Client, складений з різних частин, зчитаних з оточення
		'Uxp-Service': `${process.env.INSTANCE_NAME}/${process.env.SERVICE_MEMBER_CLASS}/${process.env.SERVICE_MEMBER_CODE}/${process.env.SERVICE_SUBSYSTEM}/${process.env.SERVICE_CODE}/${process.env.SERVICE_VERSION}` // Заголовок Uxp-Service, складений з різних частин, зчитаних з оточення
	}
	return uxpHeaders // Повертаємо об'єкт з заголовками запиту
}
