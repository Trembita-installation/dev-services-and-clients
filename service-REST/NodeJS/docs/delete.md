## Видалення cервісу вручну

**Для того, щоб видалити даний вебсервіс вручну необхідно:**

### 1. Зупинити вебсервіс:

```bash
sudo systemctl stop rest-sync-service-node-express-js
```

### 2. Видалити сервіс із автозапуску:

```bash
sudo systemctl disable rest-sync-service-node-express-js
```

### 3. Видалити systemd unit-файл та перезавантажити конфігурацію системи
```bash
sudo rm /etc/systemd/system/rest-sync-service-node-express-js.service
sudo systemctl daemon-reload
```

### 4. Видалити віртуальне середовище та файли сервісу
```bash
cd ..
sudo rm -rf rest-sync-service-node-express-js
```

### 5. Видалити базу даних та користувача:
5.1.	Увійти у консоль MariaDB:
```bash
sudo mysql
```
5.2.	Видалити базу даних:
```sql
DROP DATABASE IF EXISTS your_db_name;
```
де: `your_db_name` - назва бази даних, яку було створено при встановленні вебсервісу.

5.3.	Видалити користувача БД:
```sql
DROP USER IF EXISTS 'your_db_user'@'%';
```
де: `your_db_user` - логін користувача БД, якого було створено при встановленні вебсервісу

5.4.	Вийдти із консолі MariaDB:
```sql
exit
```

### 6. Видалення залежностей (опціонально)
```bash
sudo apt-get remove --purge -y curl libmariadb-dev gcc nodejs npm git mariadb-server
sudo apt-get autoremove -y
```

Після виконання усіх кроків необхідно переконатись, що жодних активних процесів чи файлів, пов’язаних із проєктом, більше немає в системі.

##
Матеріали створено за підтримки проєкту міжнародної технічної допомоги «Підтримка ЄС цифрової трансформації України (DT4UA)».

