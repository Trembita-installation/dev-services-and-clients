from faker import Faker
import requests
import json

fake = Faker(['uk_UA'])

url = 'http://127.0.0.1:8000/person'
count = 1

for _ in range(count):
    firstname = fake.first_name_male()
    surname = fake.last_name_male()
    patronymic = fake.middle_name_male()
    dateOfBirth = fake.date()
    rnokpp = str(fake.random_number(digits=10, fix_len=True))
    unzr = dateOfBirth.replace("-","") + "-" +str(fake.random_number(digits=5, fix_len=True))
    pasportNumber = str(fake.random_number(digits=9, fix_len=True))
    sex = "male"
    lineitems = []
    # Дані, які будуть надіслані у запиті
    data = {
        'name': firstname,
        'surname': surname,
        'patronym': patronymic,
        'dateOfBirth' : dateOfBirth,
        'rnokpp' : rnokpp,
        'unzr': unzr,
        'passportNumber': pasportNumber,
        'gender' : "male"
    }

    json_data = json.dumps(data, ensure_ascii=False, indent=4)
    #print(json_data)

    headers = {
        'Content-Type': 'application/json',  # Вказуємо тип контенту як JSON
    }

    # Надсилання POST-запиту
    response = requests.post(url, json=data, headers=headers)

    # Перевірка статусу відповіді
    if response.status_code == 200 or response.status_code == 201:
        print('Запит успішно виконаний')
        print('Відповідь:', response.json())  # Якщо відповідь у форматі JSON
    else:
        print('Помилка виконання запиту')
        print('Статус код:', response.status_code)
        print('Текст відповіді:', response.text)





