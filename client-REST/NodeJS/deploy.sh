#!/bin/bash
set -e

GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

# Змінні для конфігурації
REPO_URL="https://github.com/kshypachov/rest-sync-client-next-js-page-router.git"
PROJECT_DIR="rest-sync-client-next-js-page-router"
DAEMON_NAME="node-app-rest"

CLIENT_PORT="3001" # Порт, на якому буде запущено сервер

# Встановлення системних залежностей
echo -e "${GREEN}Встановлення системних залежностей...${RESET}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get update
sudo apt-get install -y curl gcc nodejs git

# Клонування репозиторію
echo -e "${GREEN}Клонування репозиторію...${RESET}"
git clone $REPO_URL
cd $PROJECT_DIR

# Встановлення залежностей Node.js
echo -e "${GREEN}Встановлення залежностей Node.js...${RESET}"
npm install

# Створення файлу .env та налаштування змінних середовища
echo -e "${GREEN}Створення файлу .env.local та налаштування змінних середовища...${RESET}"
cat > .env.local << EOL
# Налаштування сервісу
PORT=$CLIENT_PORT

# Налаштування вихідних запитів
# Протокол, який використовується для взаємодії з ШБО (https або http)
# Протокол https вимагає взаємної автентифікації клієнта з ШБО з використанням сертифікатів
PROTOCOL=https
# Хостнейм, FQDN або локальна IP-адреса ШБО
# можливі варіанти: 192.168.1.1, trembita.example.gov.ua
SECURITY_SERVER_IP=your_trembita_host # TREMBITA URL

PURPOSE_ID='' # Ідентифікатор мети обробки персональних даних для взаємодії з сервісами, що використовують Підсистему моніторингу доступу до персональних даних системи Трембіта (ПМДПД). Може бути не заданим (закоментувати параметр), якщо обмін відбувається без використання цього ПМДПД.
INSTANCE_NAME='SEVDEIR-TEST' # Повний ідентифікатор клієнтської підсистеми Трембіти, що використовується для надсилання повідомлень-запитів
# xRoadInstance (SEVDEIR чи SEVDEIR-TEST)

# Налаштування Uxp-Client
CLIENT_MEMBER_CLASS='GOV'
CLIENT_MEMBER_CODE='your_client_member_code'   # код ЄДРПОУ організації-клієнта
CLIENT_SUBSYSTEM='your_client_subsystem_code'   # код підсистеми ШБО організації-клієнта, що буде використовуватись для запитів
IF_CLIENT_SAVE_ASIC='true'

# Налаштування Uxp-Service
SERVICE_MEMBER_CLASS='GOV'
SERVICE_MEMBER_CODE='your_service_member_code'
SERVICE_SUBSYSTEM='your_service_subsystem_code'
SERVICE_CODE='your_service_code'
SERVICE_VERSION='your_service_version'

# Налаштування логування
LOG_LEVEL='debug' # Рівень логування (info, debug, error і т.д.)
LOG_DIRECTORY='./logs' # Директорія для збереження лог-файлів
ERROR_LOG_FILE_NAME='error.log' # Назва файлу для збереження логів помилок
COMBINED_LOG_FILE_NAME='combined.log' # Назва файлу для збереження об'єднаних логів

EOL

# Генерування сертифікатів для звʼязку з ШБО по https
echo -e "${GREEN}Генерування сертифікатів https...${RESET}"
npm run gen-crt

# Збірка проекту
echo -e "${GREEN}Збірка проекту...${RESET}"
npm run build

# Створення unit файлу для systemd
echo -e "${GREEN}Створення unit файлу для systemd...${RESET}"
sudo bash -c "cat > /etc/systemd/system/${DAEMON_NAME}.service" << EOL
[Unit]
Description=Node.js RESTful Client
After=network.target

[Service]
User=$USER
WorkingDirectory=$PWD
ExecStartPre=/usr/bin/npm run build
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=3
EnvironmentFile=$PWD/.env.local

[Install]
WantedBy=multi-user.target
EOL

# Перезапуск systemd
echo -e "${GREEN}Перезапуск systemd...${RESET}"
sudo systemctl daemon-reload
sudo systemctl enable ${DAEMON_NAME}

#Вивод повідомлення про завершення роботи
echo -e "${GREEN}Встановлення завершено! Сервіс ${DAEMON_NAME} додано в автозапуск. Для запуску використвуйте команду ${RED}sudo systemctl start ${DAEMON_NAME}${RESET}"
echo -e "${GREEN}Перед запуском, відредагуйте конфігураційний файл ${RED}.env.local${RESET}"
echo -e "${GREEN} Клієнт буде доступний за адресою ${RED}http://server_ip:${CLIENT_PORT}/${RESET}"
