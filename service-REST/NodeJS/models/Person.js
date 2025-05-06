'use strict'
const { DataTypes } = require('sequelize') // Імпортуємо DataTypes з модуля Sequelize
const Sequelize = require('sequelize') // Імпортуємо основний модуль Sequelize

module.exports = sequelize => {
	// Визначаємо модель 'Person' за допомогою sequelize.define
	const Person = sequelize.define(
		'Person',
		{
			id: {
				type: DataTypes.INTEGER, // Тип даних - ціле число
				primaryKey: true, // Первинний ключ
				autoIncrement: true // Автоматичне збільшення значення
			},
			name: {
				type: DataTypes.STRING, // Тип даних - рядок
				allowNull: false // Поле не може бути порожнім
			},
			surname: {
				type: DataTypes.STRING, // Тип даних - рядок
				allowNull: false // Поле не може бути порожнім
			},
			patronym: {
				type: DataTypes.STRING // Тип даних - рядок, поле може бути порожнім
			},
			dateOfBirth: {
				type: DataTypes.DATEONLY, // Тип даних - дата (без часу)
				allowNull: false // Поле не може бути порожнім
			},
			rnokpp: {
				type: DataTypes.STRING, // Тип даних - рядок
				allowNull: false, // Поле не може бути порожнім
				unique: true // Значення має бути унікальним
			},
			unzr: {
				type: DataTypes.STRING, // Тип даних - рядок
				allowNull: false, // Поле не може бути порожнім
				unique: true // Значення має бути унікальним
			},
			passportNumber: {
				type: DataTypes.STRING, // Тип даних - рядок
				allowNull: false, // Поле не може бути порожнім
				unique: true // Значення має бути унікальним
			},
			gender: {
				type: DataTypes.ENUM('male', 'female'), // Перечислення можливих значень
				allowNull: false // Поле не може бути порожнім
			}
		},
		{
			sequelize, // Передаємо екземпляр sequelize
			modelName: 'Person', // Явно вказуємо ім'я моделі
			tableName: 'Persons' // Явно вказуємо ім'я таблиці
		}
	)

	return Person // Повертаємо визначену модель 'Person'
}
