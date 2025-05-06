// components/FormComponent.js

// Імпортуємо компоненти форми з бібліотеки React Bootstrap
import { Form, Button } from 'react-bootstrap'

// Компонент форми
const FormComponent = ({
	formData, // Дані форми
	formFieldsNames, // Назви полів форми
	isDataRequired, // Показник обов'язковості даних
	handleSubmit, // Обробник затвердження форми
	handleChange, // Обробник зміни значення поля форми
	isFieldsDisabled // Показник відключення полів форми
}) => {
	return (
		<Form id='personForm' onSubmit={handleSubmit}>
			{/* Ітеруємося по кожному полю форми та рендеримо його */}
			{Object.entries(formFieldsNames).map(([fieldName, label]) => (
				<Form.Group controlId={`form${fieldName}`} key={fieldName}>
					{/* Відображаємо мітку поля форми */}
					<Form.Label>{label}</Form.Label>
					{/* В залежності від типу поля, відображаємо відповідний елемент форми */}
					{fieldName === 'dateOfBirth' ? (
						<Form.Control
							type='date'
							name={fieldName}
							value={formData[fieldName]}
							onChange={handleChange}
							required={isDataRequired[fieldName]}
							disabled={isFieldsDisabled}
						/>
					) : fieldName === 'gender' ? (
						<Form.Control
							as='select'
							name={fieldName}
							value={formData[fieldName]}
							onChange={handleChange}
							required={isDataRequired[fieldName]}
							disabled={isFieldsDisabled}
						>
							<option value=''>{label}</option>
							<option value='male'>Чоловіча</option>
							<option value='female'>Жіноча</option>
						</Form.Control>
					) : (
						<Form.Control
							type='text'
							name={fieldName}
							value={formData[fieldName]}
							onChange={handleChange}
							required={isDataRequired[fieldName]}
							disabled={isFieldsDisabled}
						/>
					)}
				</Form.Group>
			))}
		</Form>
	)
}
// Експортуємо компонент форми
export default FormComponent
