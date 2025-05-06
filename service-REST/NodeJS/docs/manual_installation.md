# Інсталяція сервісу вручну

Також існує можливість встановлення вебсервісу вручну, без застосування скрипта.
Для початку роботи потрібно мати чисту систему Ubuntu, всі необхідні пакети та репозиторії будуть підключені в ході виконання встановлення.

**Для того, щоб встановити даний вебсервіс вручну необхідно:**

### 1. Встановити необхідні пакети:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - 
sudo apt-get update
sudo apt-get install -y curl libmariadb-dev gcc nodejs git
```

### 2. Додати репозиторій MariaDB:

```bash
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | sudo bash
```
### 3. Встановити СУБД MariaDB:

```bash
sudo apt-get update
sudo apt-get install -y mariadb-server
```
### 4. Запустити MariaDB та налаштувати автозапуск:

```bash
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

### 5. Перевірити, чи працює MariaDB:

```bash
sudo systemctl status mariadb
```

**Примітка** Якщо базу даних запущено, можна переходити до виконання наступних кроків.
Інакше – потрібно перевірити чи не було допущено помилку при виконанні одного з попередніх кроків.

### 6. Створити базу даних та користувача. Для цього необхідно:

6.1. Увійти у консоль MariaDB:

```bash
sudo mysql
```

6.2. Створити базу даних:
```sql
CREATE DATABASE IF NOT EXISTS your_db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
де: `your_db_name` - бажана назва БД.

6.3. Створити користувача:
```sql
CREATE USER IF NOT EXISTS 'your_db_user'@'%' IDENTIFIED BY 'your_db_password';
```
де:
- `your_db_user` – логін користувача БД;
- `your_db_password`– пароль для даного користувача.

6.4. Надати користувачеві повні права на базу даних, замінивши `your_db_name` на назву раніше створеної  БД а `your_db_user` на логін створеного на попередньому кроці користувача:
```sql
GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_db_user'@'%';
```

6.5. Примусово оновити привілеї:

```sql
FLUSH PRIVILEGES;
```

Базу даних та користувача успішно створено.

6.6. Вийти з консолі MariaDB:

```bash
exit
```

### 7. Клонувати репозиторій:

```bash
git clone https://github.com/Trembita-installation/dev-services-and-clients.git
```

### 8. Перейти до директорії з вебсервісом:

```bash
cd dev-services-and-clients/service-REST/NodeJS
```

### 9. Встановити залежності Node.js

```bash
npm install
```

### 10. Запустити процес генерування документації:

```bash
npm run swagger
```

### 11. Виконати конфігурацію вебсервісу згідно [настанов з конфігурації](./docs/configuration.md)

### 12. Створити структуру бази даних

```bash
npx sequelize db:migrate
```

### 13. Створити systemd unit-файл для запуску вебсервісу:

**Примітка** Перед виконанням команди необхідно перевірити за допомого команди `pwd` що ви знаходитесь у директорії `rest-sync-service-node-express-js`.

Створіть systemd unit-файл для запуску сервісу:

```bash
sudo bash -c "cat > /etc/systemd/system/rest-sync-service-node-express-js.service" << EOL
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
```

### 14.	Перезавантажити конфігурацію systemd:

```bash
sudo systemctl daemon-reload
```

### 15. Додати сервіс до автозапуску:

```bash
sudo systemctl enable rest-sync-service-node-express-js
```

##
Матеріали створено за підтримки проєкту міжнародної технічної допомоги «Підтримка ЄС цифрової трансформації України (DT4UA)».
