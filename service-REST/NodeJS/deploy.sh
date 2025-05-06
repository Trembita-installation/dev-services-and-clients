#!/bin/bash
set -e

GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"
 
# Змінні для конфігурації
REPO_URL="https://github.com/kshypachov/rest-sync-service-node-express-js.git"
PROJECT_DIR="rest-sync-service-node-express-js"
SERVICE_NAME="rest-sync-service-node-express-js"

DB_USER="node_user"
DB_PASSWORD="node_password"
DB_NAME="node_serv_name"
DB_HOST="localhost" # Використовується localhost для встановлення MariaDB на цьому сервері
DB_PORT="3306"      # Порт за замовчуванням для MariaDB
SERVICE_PORT="3000" # Порт, на якому буде запущено сервер
 
# Встановлення системних залежностей
echo -e "${GREEN}Встановлення системних залежностей...${RESET}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - 
sudo apt-get update
sudo apt-get install -y curl libmariadb-dev gcc nodejs git
 
# Налаштування репозиторію MariaDB
echo -e "${GREEN}Налаштування репозиторію MariaDB...${RESET}"
curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash
 
# Встановлення MariaDB сервера
echo -e "${GREEN}Встановлення MariaDB сервера...${RESET}"
sudo apt-get install -y mariadb-server
 
# Запуск та налаштування MariaDB
echo -e "${GREEN}Запуск та налаштування MariaDB...${RESET}"
sudo systemctl start mariadb
sudo systemctl enable mariadb
 
# Створення бази даних та користувача
echo -e "${GREEN}Створення бази даних та користувача...${RESET}"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';"
sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';"
sudo mysql -e "FLUSH PRIVILEGES;"
 
# Клонування репозиторію
echo -e "${GREEN}Клонування репозиторію...${RESET}"
git clone $REPO_URL
cd $PROJECT_DIR
 
# Встановлення залежностей Node.js
echo -e "${GREEN}Встановлення залежностей Node.js...${RESET}"
npm install

# Генерування Swagger документації
echo -e "${GREEN}Генерування Swagger документації...${RESET}"
npm run swagger

# Створення файлу .env та налаштування змінних середовища
echo -e "${GREEN}Створення файлу .env та налаштування змінних середовища...${RESET}"
cat > .env << EOL
# Налаштування сервісу
PORT=$SERVICE_PORT
 
# Налаштування бази даних
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_NAME=$DB_NAME
DB_PASSWORD=$DB_PASSWORD
 
# Налаштування логування
LOG_LEVEL='debug'
LOG_DIRECTORY='./logs'
ERROR_LOG_FILE_NAME='error.log'
COMBINED_LOG_FILE_NAME='combined.log'
EOL
 
# Виконання міграцій бази даних
echo -e "${GREEN}Виконання міграцій бази даних...${RESET}"
npx sequelize db:migrate
 
# Створення unit файлу для systemd
echo -e "${GREEN}Створення unit файлу для systemd...${RESET}"
sudo bash -c "cat > /etc/systemd/system/$SERVICE_NAME.service" << EOL
[Unit]
Description=Node.js RESTful API Service
After=network.target
 
[Service]
User=$USER
WorkingDirectory=$PWD
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=3
EnvironmentFile=$PWD/.env
 
[Install]
WantedBy=multi-user.target
EOL
 
# Перезапуск systemd та запуск сервісу
echo -e "${GREEN}Перезапуск systemd та запуск сервісу...${RESET}"
sudo systemctl daemon-reload
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME
 
echo -e "${GREEN}Встановлення завершено! Сервіс ${RED} $SERVICE_NAME ${GREEN} запущено та додано в автозапуск.${RESET}"
