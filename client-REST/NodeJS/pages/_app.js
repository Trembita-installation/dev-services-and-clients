// pages/_app.js
// Імпортуємо стилі Bootstrap та глобальні стилі нашого додатку.
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Основний компонент додатку, який обгортає всі інші компоненти Next.js.
const MyApp = ({ Component, pageProps }) => {
	// Об'єкт, що містить пусті дані для форми.
	const blankFormData = {
		name: '',
		surname: '',
		patronym: '',
		dateOfBirth: '',
		gender: '',
		unzr: '',
		rnokpp: '',
		passportNumber: ''
	}
	// Об'єкт, що містить назви полів форми для відображення.
	const formFieldsNames = {
		name: "Ім'я",
		surname: 'Прізвище',
		patronym: 'По батькові',
		dateOfBirth: 'Дата народження',
		gender: 'Стать',
		unzr: 'УНЗР',
		rnokpp: 'РНОКПП',
		passportNumber: 'Номер паспорту'
	}
	// Використовуємо useState для зберігання останньої вибраної особи.
	const [selectedPerson, setSelectedPerson] = useState(null)
	// Повертаємо компонент, що обгортає інші компоненти Next.js і передає необхідні пропси.
	return (
		<div>
			<Component
				{...pageProps}
				blankFormData={blankFormData} // Передаємо початкові значення форми як пропс
				formFieldsNames={formFieldsNames} // Передаємо назви полів форми як пропс
				selectedPerson={selectedPerson} // Передаємо вибрану особу як пропс
				setSelectedPerson={setSelectedPerson} // Передаємо функцію для зміни вибраної особи як пропс
			/>
			<ToastContainer style={{ marginTop: '56px' }} />{' '}
			{/* Компонент для відображення сповіщень */}
		</div>
	)
}
// Експортуємо основний компонент додатку.
export default MyApp
