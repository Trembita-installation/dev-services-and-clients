#!/bin/bash

set -e

GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

DAEMON_NAME="node-app-rest"
PROJECT_DIR="rest-sync-client-next-js-page-router"


# Зупинка та вимкнення додатку
echo -e "${GREEN}Зупинка додатку...${RESET}"
sudo systemctl stop ${DAEMON_NAME}
sudo systemctl disable ${DAEMON_NAME}

# Видалення Unit файлу systemd
echo -e "${GREEN}Видалення Unit файлу systemd...${RESET}"
sudo rm /etc/systemd/system/${DAEMON_NAME}.service

# Перезавантаження systemd для застосування змін
echo -e "${GREEN}ПЕрезавантаження systemd...${RESET}"
sudo systemctl daemon-reload

# Видалення репозиторію
echo -e "${GREEN}Видалення директорії проекту...${RESET}"
cd ../
sudo rm -rf ${PROJECT_DIR}

# Видалення встановлених пакетів
echo -e "${GREEN}Видалення пакету nodejs...${RESET}"
sudo apt remove -y nodejs

# Очищення системи від непотрібних пакетів та залежностей
echo -e "${GREEN}Очищення системи від непотрібних пакетів та залежностей...${RESET}"
sudo apt autoremove -y
sudo apt clean


