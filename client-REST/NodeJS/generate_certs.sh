#!/bin/bash
set -e

GREEN="\033[32m"
RESET="\033[0m"

CERTS_DIR="./certs"
KEY_FILE="$CERTS_DIR/key.pem"       # Сразу PKCS#8
CERT_FILE="$CERTS_DIR/cert.pem"
SUBJ="/C=UA/ST=Kyiv/L=Kyiv/O=Trembita/OU=Dev/CN=localhost"

# Створення директорії
mkdir -p "$CERTS_DIR"

# Генерація ECDSA ключа у форматі PKCS#8
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:prime256v1 -out "$KEY_FILE"

# Генерація самопідписаного сертифіката
openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 -subj "$SUBJ"

# Повідомлення
echo -e "${GREEN}Сертифікати згенеровано, у директорії ${CERTS_DIR}. Можете додати сертифікат Трембіти (service-cert.pem) та запустити збірку Докер контейнеру.${RESET}"