import DropdownComponent from '../components/DropdownComponent'
import FormComponent from '../components/FormComponent'
import NavBar from '../components/NavBar'
import PaginationComponent from '../components/PaginationComponent'
import axios from '../utils/axiosFrontend'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Button, Container, Form, Pagination, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'

// Сторінка для пошуку особи в реєстрі
export default function FindPerson({
	blankFormData,
	formFieldsNames,
	setSelectedPerson,
	selectedPerson
}) {
	// Ініціалізуємо роутер та стани для форми та результатів пошуку
	const router = useRouter()
	const [state, setState] = useState({
		isFieldsDisabled: false, // Стан для керування блокуванням полів
		formData: { ...blankFormData }, // Стан для зберігання даних форми
		results: null, // Стан для зберігання результатів пошуку
		currentPage: 1, // Стан для зберігання поточної сторінки
		totalPages: 1, // Стан для зберігання загальної кількості сторінок
		perPage: 50, // Стан для зберігання кількості записів на сторінці
		totalCount: 0 // Стан для зберігання загальної кількості записів
	})
	const isDataRequired = {
		name: false,
		surname: false,
		patronym: false,
		dateOfBirth: false,
		rnokpp: false,
		unzr: false,
		passportNumber: false,
		gender: false
	} // Об'єкт для зберігання інформації про обов'язковість полів

	// Функція для обробки зміни значення поля форми
	const handleChange = e => {
		const { name, value } = e.target
		setState(prevState => ({
			...prevState,
			formData: { ...prevState.formData, [name]: value }
		}))
	}
	// Функція для очищення форми
	const handleClear = () => {
		toast.info('Форму очищено') // Відображення повідомлення про очищення форми
		setState(prevState => ({
			...prevState,
			formData: { ...blankFormData }
		}))
	}
	// Функція для виконання запиту на сервер
	const handleFetch = useCallback(
		async (pageReset = false, e) => {
			if (e) {
				e.preventDefault()
			}
			if (pageReset) {
				setState(prevState => ({
					...prevState,
					currentPage: 1
				}))
			}

			const { formData, currentPage, perPage } = state
			const filteredFormData = Object.fromEntries(
				Object.entries(formData).filter(([_, value]) => value)
			)
			const params = new URLSearchParams({
				...filteredFormData,
				_page: currentPage,
				_limit: perPage
			})
			try {
				const response = await axios.get(`/person`, { params })

				if (response.status === 200) {
					const data = response.data
					const totalCount = data.totalCount
					const totalPages = Math.ceil(totalCount / perPage)
					setState(prevState => ({
						...prevState,
						results: data.persons,
						totalCount,
						totalPages
					}))

					let toastMessage = `Знайдено ${totalCount} ${
						totalCount % 10 === 1 && totalCount % 100 !== 11
							? 'запис'
							: totalCount % 10 >= 2 &&
							  totalCount % 10 <= 4 &&
							  (totalCount % 100 < 10 || totalCount % 100 >= 20)
							? 'записи'
							: 'записів'
					}`
					toast.info(toastMessage)
				} else {
					console.log(response)
					toast.error(response.data)
					setState(prevState => ({
						...prevState,
						results: [],
						totalCount: 0,
						totalPages: 1
					}))
				}
			} catch (error) {
				console.log(error)
				toast.error('Внутрішня помилка серверу')
			}
		},
		[state.formData, state.currentPage, state.perPage]
	)
	// Функція для зміни поточної сторінки
	const handlePageChange = pageNumber => {
		setState(prevState => ({
			...prevState,
			currentPage: pageNumber
		}))
	}
	// Функція для зміни кількості записів на сторінці
	const handlePerPageChange = e => {
		const newPerPage = parseInt(e.target.value, 10)
		setState(prevState => ({
			...prevState,
			perPage: newPerPage,
			currentPage: 1 // Скидаємо поточну сторінку на першу при зміні кількості записів на сторінці
		}))
	}
	// Функція для відправки запиту на сервер
	const handleSubmit = async e => {
		e.preventDefault()
		await handleFetch(true)
	}
	// Функція для переходу на сторінку з детальною інформацією про особу
	const handlePersonInfo = person => {
		setSelectedPerson(person)
		router.push(`/read-person`)
	}
	// Функція для виконання запиту на сервер при зміні сторінки або кількості записів на сторінці
	useEffect(() => {
		handleFetch()
	}, [state.currentPage, state.perPage])

	// Відображення компоненту
	return (
		<div>
			<NavBar selectedPerson={selectedPerson} />
			<Container>
				<div>
					{/* Заголовок сторінки */}
					<h2 className='mt-5'>
						Введіть часткові данні особи щоб знайти запис в електронному
						реєстрі.
					</h2>
					{/* Компонент форми */}
					<FormComponent
						formData={state.formData}
						formFieldsNames={formFieldsNames}
						isDataRequired={isDataRequired}
						isFieldsDisabled={state.isFieldsDisabled}
						handleChange={handleChange}
						handleSubmit={handleSubmit}
					/>
					{/* Кнопка для відправки форми */}
					<Button
						variant='primary'
						type='submit'
						form='personForm'
						className='mt-3'
					>
						Знайти особу
					</Button>
					{/* Кнопка для очищення форми */}
					<Button
						variant='secondary'
						onClick={handleClear}
						className='mt-3 ms-3'
					>
						Очистити форму
					</Button>
				</div>
				{/* Відображення пагінації, якщо є кілька сторінок результатів */}
				{state.totalPages > 0 && (
					<PaginationComponent
						currentPage={state.currentPage}
						totalPages={state.totalPages}
						onPageChange={handlePageChange}
					/>
				)}
				{/* Форма для вибору кількості записів на сторінці */}
				<DropdownComponent
					label='Кількість записів на сторінці'
					value={state.perPage}
					onChange={handlePerPageChange}
					options={[10, 50, 100]}
				/>
				{/* Відображення результатів пошуку у вигляді таблиці */}
				{state.results && (
					<div>
						{/* Виведення заголовка з кількістю знайдених записів */}
						<h3>
							Знайдено {state.totalCount}{' '}
							{state.totalCount % 10 === 1 && state.totalCount % 100 !== 11
								? 'запис'
								: state.totalCount % 10 >= 2 &&
								  state.totalCount % 10 <= 4 &&
								  !(
										state.totalCount % 100 >= 12 && state.totalCount % 100 <= 14
								  )
								? 'записи'
								: 'записів'}
						</h3>
						{/* Таблиця з результатами пошуку */}
						{state.totalCount > 0 ? (
							<Table className='mt-4' striped bordered hover>
								<thead>
									<tr>
										{/* Виведення заголовків колонок */}
										{Object.entries(formFieldsNames).map(([key, label]) => (
											<th key={key}>{label}</th>
										))}
										<th>Дія</th>
										{/* Додавання нового заголовка для стовпця з діями */}
									</tr>
								</thead>
								<tbody>
									{/* Виведення результатів пошуку у вигляді рядків таблиці */}
									{state.results.map((person, index) => (
										<tr key={index}>
											{/* Виведення даних згідно назв полів форми */}
											{Object.keys(formFieldsNames).map(fieldName => (
												<td key={fieldName}>{person[fieldName]}</td>
											))}
											<td>
												{/* Кнопка для переходу на сторінку з детальною інформацією */}
												<Button
													variant='dark'
													onClick={() => handlePersonInfo(person)}
												>
													Інфо
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						) : (
							''
						)}
					</div>
				)}
			</Container>
		</div>
	)
}
