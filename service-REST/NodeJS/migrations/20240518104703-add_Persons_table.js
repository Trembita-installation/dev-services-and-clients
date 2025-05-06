'use strict'
// npx sequelize migration:generate --name add_Persons_table - Команда для генерації міграції
// npx sequelize db:migrate - Команда для виконання міграцій
// npx sequelize db:migrate:undo - Команда для відміни останньої міграції
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Створення таблиці 'Persons' з відповідними полями
		await queryInterface.createTable('Persons', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true // Автоматичне збільшення ID
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false // Поле не може бути порожнім
			},
			surname: {
				type: Sequelize.STRING,
				allowNull: false // Поле не може бути порожнім
			},
			patronym: {
				type: Sequelize.STRING
			},
			dateOfBirth: {
				type: Sequelize.DATEONLY,
				allowNull: false // Поле не може бути порожнім
			},
			rnokpp: {
				type: Sequelize.STRING,
				allowNull: false, // Поле не може бути порожнім
				unique: true // Значення має бути унікальним
			},
			unzr: {
				type: Sequelize.STRING,
				allowNull: false, // Поле не може бути порожнім
				unique: true // Значення має бути унікальним
			},
			passportNumber: {
				type: Sequelize.STRING,
				allowNull: false, // Поле не може бути порожнім
				unique: true // Значення має бути унікальним
			},
			gender: {
				type: Sequelize.ENUM('male', 'female'),
				allowNull: false // Поле не може бути порожнім
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false, // Поле не може бути порожнім
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Значення за замовчуванням - поточний час
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false, // Поле не може бути порожнім
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Значення за замовчуванням - поточний час
			}
		})
	},

	async down(queryInterface, Sequelize) {
		// У зворотній міграції ми просто видаляємо таблицю 'Persons'
		await queryInterface.dropTable('Persons')
	}
}

