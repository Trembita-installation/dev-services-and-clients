from zeep import Client
from zeep.transports import Transport
from requests import Session
from faker import Faker


fake = Faker(['uk_UA'])
count = 10

# Вказуємо URL WSDL-файлу
wsdl = 'http://localhost:8000/?wsdl'


session = Session()
transport = Transport(session=session)
# Створюємо клієнта
client = Client(wsdl=wsdl, transport=transport)

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

    # Створюємо дані для нового користувача
    person_data = {
        "name": firstname,
        "surname": surname,
        "patronym":  patronymic,
        "dateOfBirth": dateOfBirth,
        "gender": "male",
        "rnokpp": rnokpp,
        "passportNumber": pasportNumber,
        "unzr": unzr
    }

    # Викликаємо метод create_person
    response = client.service.create_person(person_data)

    # Друкуємо відповідь
    print(response)

print("The END!")