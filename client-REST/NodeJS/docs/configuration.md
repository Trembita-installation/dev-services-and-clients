## Конфігурація вебклієнту

Для конфігурації вебклієнту необхідно:

1. Створити файл конфігурації `.env.local` в кореневій директорії проєкту з наступним вмістом (або перейменувати файл `.env.example` в `.env.local` та заповнити відповідні параметри):

```env
# Налаштування Next.js
PORT='3001'

# Налаштування вихідних запитів
# Протокол, який використовується для взаємодії з ШБО (https або http)
# Протокол https вимагає взаємної автентифікації клієнта з ШБО з використанням сертифікатів
PROTOCOL=https
# Хостнейм, FQDN або локальна IP-адреса ШБО
# можливі варіанти: 192.168.1.1, trembita.example.gov.ua
SECURITY_SERVER_IP=your_trembita_host # TREMBITA URL

PURPOSE_ID='5cbc1e1b-be44-4679-9214-3d4995b35d3a' # Ідентифікатор мети обробки персональних даних для взаємодії з сервісами, що використовують Підсистему моніторингу доступу до персональних даних системи Трембіта (ПМДПД). Може бути не заданим (закоментувати параметр), якщо обмін відбувається без використання цього ПМДПД.
INSTANCE_NAME='SEVDEIR-TEST' # Повний ідентифікатор клієнтської підсистеми Трембіти, що використовується для надсилання повідомлень-запитів
# xRoadInstance (SEVDEIR чи SEVDEIR-TEST)

# Налаштування Uxp-Client
CLIENT_MEMBER_CLASS='GOV'
CLIENT_MEMBER_CODE='your_client_member_code'   # код ЄДРПОУ організації-клієнта
CLIENT_SUBSYSTEM=' your_client_subsystem_code'   # код підсистеми ШБО організації-клієнта, що буде використовуватись для запитів
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
```
