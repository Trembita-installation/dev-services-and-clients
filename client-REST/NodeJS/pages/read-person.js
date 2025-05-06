import FormComponent from '../components/FormComponent'
import NavBar from '../components/NavBar'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axios from '../utils/axiosFrontend'

// Сторінка профіль особи
const ReadPerson = ({
	blankFormData,
	formFieldsNames,
	setSelectedPerson,
	selectedPerson
}) => {
	const router = useRouter()

	// Стан компоненту для управління формою та режимом її блокування
	const [formData, setFormData] = useState({ ...blankFormData }) // Форма з початковими даними
	const [isFieldsDisabled, setIsFieldsDisabled] = useState(true) // Прапорець, що вказує на стан блокування форми

	// Об'єкт, що визначає обов'язковість полів форми
	const isDataRequired = {
		name: true,
		surname: true,
		patronym: false,
		dateOfBirth: true,
		rnokpp: true,
		unzr: true,
		passportNumber: true,
		gender: true
	}

	// Ефект для оновлення даних форми при зміні обраної особи
	useEffect(() => {
		if (selectedPerson) {
			setFormData(selectedPerson)
		}
	}, [selectedPerson])

	// Функція для зміни стану блокування форми
	const toggleDisabled = () => {
		setIsFieldsDisabled(!isFieldsDisabled)
		toast.info(
			`${!isFieldsDisabled ? 'Запис заблоковано' : 'Запис розблоковано'}`
		)
	}
	// Функція для обробки зміни значення в полі форми
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value
		}))
	}
	// Функція для обробки відправки форми
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await axios.put(`/person`, {
				attribute: 'unzr',
				value: selectedPerson.unzr,
				...formData
			})

			const data = response.data
			if (response.status === 200) {
				setSelectedPerson(formData)
				toast.success(data)
				setIsFieldsDisabled(!isFieldsDisabled)
			} else {
				console.log(response)
				toast.error(data)
			}
		} catch (error) {
			console.error(error)
			toast.error('Внутрішня помилка серверу')
		}
	}
	// Функція для обробки видалення запису про особу
	const handleDelete = async () => {
		const params = new URLSearchParams({
			attribute: 'unzr',
			value: selectedPerson.unzr
		})
		try {
			const response = await axios.delete(`/person`, {
				params: params
			})
			const data = response.data
			if (response.status === 200) {
				toast.success(data)
				setSelectedPerson(null)
				router.push(`/find-person`)
			} else {
				toast.error(data)
			}
		} catch (error) {
			console.log(error)
			toast.error('Внутрішня помилка серверу')
		}
	}

	// Відображення компоненту
	return (
		<div>
			{/* Компонент навігаційного бару */}
			<NavBar selectedPerson={selectedPerson} />
			<Container>
				{/* Заголовок сторінки */}
				<h2 className='mt-5'>Профіль особи</h2>
				{/* Компонент форми */}
				<FormComponent
					formData={formData}
					formFieldsNames={formFieldsNames}
					isDataRequired={isDataRequired}
					isFieldsDisabled={isFieldsDisabled}
					handleSubmit={handleSubmit}
					handleChange={handleChange}
				/>
				{/* Кнопка розблокування/заблокування форми */}
				<Button variant='dark' onClick={toggleDisabled} className='mt-3'>
					{isFieldsDisabled
						? 'Розблокувати запис'
						: 'Заблокувати\u00A0\u00A0\u00A0запис'}
				</Button>
				{/* Кнопка збереження змін форми */}
				<Button
					variant='success'
					type='submit'
					form='personForm'
					className='mt-3 ms-3'
					disabled={isFieldsDisabled}
				>
					Зберегти зміни
				</Button>
				{/* Кнопка видалення запису */}
				<Button
					variant='danger'
					onClick={handleDelete}
					className='mt-3 ms-3'
					disabled={isFieldsDisabled}
				>
					Видалити запис
				</Button>
			</Container>
		</div>
	)
}

export default ReadPerson
