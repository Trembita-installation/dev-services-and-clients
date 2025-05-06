import DropdownComponent from '../components/DropdownComponent'
import NavBar from '../components/NavBar'
import PaginationComponent from '../components/PaginationComponent'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Button, Container, Form, Pagination, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'

const DownloadAsic = ({ selectedPerson }) => {
	// Стан компоненту для управління списком файлів і пагінацією
	const [state, setState] = useState({
		files: [],
		currentPage: 1,
		totalPages: 1,
		perPage: 100,
		totalCount: 0,
		loading: false,
		error: null
	})

	// Функція для отримання списку файлів з сервера
	const fetchFiles = useCallback(async perPage => {
		setState(prevState => ({ ...prevState, loading: true, error: null }))
		try {
			const response = await axios.get('/api/list-asic')
			const sortedFiles = response.data.files.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			)
			const totalCount = sortedFiles.length
			const totalPages = Math.ceil(totalCount / perPage)
			setState(prevState => ({
				...prevState,
				files: sortedFiles,
				totalCount,
				totalPages,
				loading: false
			}))
		} catch (error) {
			console.log(error)
			setState(prevState => ({
				...prevState,
				files: [],
				totalCount: 0,
				totalPages: 1,
				loading: false,
				error: 'Failed to fetch files'
			}))
		}
	}, [])

	// Ефект для виклику отримання файлів при зміні параметрів сторінки
	useEffect(() => {
		fetchFiles(state.perPage)
	}, [fetchFiles, state.perPage])

	// Функція для зміни поточної сторінки
	const handlePageChange = pageNumber => {
		setState(prevState => ({ ...prevState, currentPage: pageNumber }))
	}
	// Функція для зміни кількості записів на сторінці
	const handlePerPageChange = e => {
		const newPerPage = parseInt(e.target.value, 10)
		setState(prevState => ({
			...prevState,
			perPage: newPerPage,
			currentPage: 1
		}))
		fetchFiles(newPerPage)
	}
	// Функція для отримання відфільтрованого списку файлів для поточної сторінки
	const getPaginatedFiles = () => {
		const startIndex = (state.currentPage - 1) * state.perPage
		const endIndex = startIndex + state.perPage
		return state.files.slice(startIndex, endIndex)
	}
	// Відображення компоненту
	return (
		<div>
			{/* Компонент навігаційного бару */}
			<NavBar selectedPerson={selectedPerson} />
			<Container>
				<div>
					<h2 className='my-4'>
						Завантаження підписаних повідомлень із шлюзу безпечного обміну у
						вигляді ASIC-контейнеру
					</h2>
					<p>
						Кожне повідомлення, якими обмінюються між собою шлюзи безпечного
						обміну, підписується та шифрується.
					</p>
					<p>
						Функціонал шлюзу безпечного обміну надає можливість завантажити
						будь-яке повідомлення та відповідь на нього у вигляді
						ASiC-контейнеру (Associated Signature Containers).
					</p>
					<p>
						Клієнт, після виконання кожного запиту до через шлюз безпечного
						обміну, автоматично зберігає ASIC-контейнер та надає користувачеві
						можливість завантажити останні повідомлення.
					</p>
				</div>
				{/* Відображення інформації про завантаження */}
				{state.loading && <p>Loading...</p>}
				{state.error && <p>{state.error}</p>}
				{/* Відображення пагінації */}
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
				{/* Відображення списку файлів */}
				{state.files.length > 0 && (
					<Table striped bordered hover>
						<thead className='thead-dark'>
							<tr>
								<th scope='col'>№</th>
								<th scope='col'>
									Ідентифікатор транзакції повідомлення - queryId
								</th>
								<th scope='col'>Час повідомлення</th>
								<th scope='col'>Завантажити</th>
							</tr>
						</thead>
						<tbody>
							{/* Відображення кожного файлу */}
							{getPaginatedFiles().map((file, index) => (
								<tr key={index}>
									<th scope='row'>{index + 1}</th>
									<td>{file.name}</td>
									<td>{new Date(file.createdAt).toLocaleString()}</td>
									<td>
										{/* Кнопка для завантаження файлу */}
										<Button
											variant='secondary'
											download={`${file.name}`}
											href={`/api/download?fileType=asic&fileName=${file.name}`}
											onClick={() => toast.info('Завантаження ASiC')}
										>
											Download
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Container>
		</div>
	)
}

export default DownloadAsic
