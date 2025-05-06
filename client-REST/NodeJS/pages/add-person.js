import FormComponent from '../components/FormComponent'
import NavBar from '../components/NavBar'
import axios from '../utils/axiosFrontend'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { toast } from 'react-toastify'

// Сторінка для додавання особи до реєстру
export default function AddPerson({
	blankFormData,
	formFieldsNames,
	selectedPerson,
	setSelectedPerson
}) {
	// Ініціалізуємо роутер та стани для форми
	const router = useRouter()
	const [formData, setFormData] = useState({ ...blankFormData }) // Стан для зберігання даних форми
	const [isFieldsDisabled, setIsFieldsDisabled] = useState(false) // Стан для керування блокуванням полів
	const isDataRequired = {
		name: true,
		surname: true,
		patronym: false,
		dateOfBirth: true,
		rnokpp: true,
		unzr: true,
		passportNumber: true,
		gender: true
	} // Об'єкт для зберігання інформації про обов'язковість полів

	// Функція для обробки зміни значення поля форми
	const handleChange = e => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}
	// Функція для очищення форми
	const handleClear = () => {
		setFormData({ ...blankFormData })
		toast.info('Форму очищено') // Відображення повідомлення про очищення форми
	}
	// Функція для обробки подання форми
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await axios.post(`/person`, formData, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const data = response.data
			if (response.status === 201) {
				toast.success(
					'Запис доданий до електронного реєстру. Профіль особи створено.'
				)
				setSelectedPerson(data)
				router.push(`/read-person`)
			} else {
				toast.error(`Помилка. Особу не вдалося додати до реєстру ${data}`)
			}
		} catch (error) {
			console.error('Error:', error)
			toast.error(`Помилка. Особу не вдалося додати до реєстру ${error}`)
		}
	}
	// Відображення компоненту
	return (
		<div>
			<NavBar selectedPerson={selectedPerson} />
			<Container>
				<div>
					{/* Заголовок сторінки */}
					<h2 className='mt-5'>
						Введіть повні данні особи щоб додати запис до електронного реєстру.
					</h2>
					{/* Компонент форми */}
					<FormComponent
						formFieldsNames={formFieldsNames}
						formData={formData}
						isDataRequired={isDataRequired}
						isFieldsDisabled={isFieldsDisabled}
						submitButtonText='Надіслати форму і створити особу'
						handleSubmit={handleSubmit}
						handleChange={handleChange}
					/>
					{/* Кнопка для очищення форми */}
					<Button variant='secondary' onClick={handleClear} className='mt-3'>
						Очистити форму
					</Button>
					{/* Кнопка для подання форми */}
					<Button
						variant='success'
						type='submit'
						form='personForm'
						className='mt-3 ms-3'
					>
						Надіслати форму і створити особу
					</Button>
				</div>
			</Container>
		</div>
	)
}
