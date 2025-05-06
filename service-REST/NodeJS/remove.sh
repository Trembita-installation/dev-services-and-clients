#!/bin/bash
set -e

GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

# Змінні
PROJECT_DIR="rest-sync-service-node-express-js"
ENV_FILE="$PROJECT_DIR/.env"
SERVICE_NAME="rest-sync-service-node-express-js"

# Перевірка наявності .env файлу
if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${RED}Файл .env не знайдено в $PROJECT_DIR. Неможливо отримати налаштування бази даних.${RESET}"
    exit 1
fi

# Надійне завантаження змінних з .env (без інлайн-коментарів)
set -a
source <(grep -v '^#' "$ENV_FILE" | sed 's/ *#.*//g')
set +a

# Перевірка необхідних змінних
if [[ -z "$DB_NAME" || -z "$DB_USER" ]]; then
    echo -e "${RED}Не вдалося зчитати DB_NAME або DB_USER з файлу .env.${RESET}"
    exit 1
fi

echo -e "${GREEN}Зупинка та вимкнення systemd-сервісу...${RESET}"
sudo systemctl stop "$SERVICE_NAME" || true
sudo systemctl disable "$SERVICE_NAME" || true

echo -e "${GREEN}Видалення systemd unit файлу...${RESET}"
sudo rm -f /etc/systemd/system/"$SERVICE_NAME".service
sudo systemctl daemon-reload

echo -e "${GREEN}Видалення проєктної директорії...${RESET}"
rm -rf "$PROJECT_DIR"

echo -e "${GREEN}Видалення користувача та бази даних MariaDB...${RESET}"
sudo mysql -e "DROP DATABASE IF EXISTS \`$DB_NAME\`;"
sudo mysql -e "DROP USER IF EXISTS '$DB_USER'@'%';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo -e "${GREEN}Видалення встановлених пакетів (опціонально)...${RESET}"
read -p "Бажаєте видалити встановлені пакети (Node.js, MariaDB)? [y/N] " confirm
if [[ "$confirm" =~ ^[Yy]$ ]]; then
    sudo apt-get remove --purge -y nodejs mariadb-server libmariadb-dev gcc git curl
    sudo apt-get autoremove -y
    echo -e "${GREEN}Пакети видалено.${RESET}"
fi

echo -e "${GREEN}Видалення завершено.${RESET}"