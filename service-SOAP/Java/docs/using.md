### **Add Persona**

Створюється один запис з БД про певну особу.

|  Код сервісу  | Базова URL                       |
|:-------------:|----------------------------------|
| addPersona    | http://your-server-ip:8080/ws    |


**Параметри запиту** виглядають наступним чином:

```
   <soapenv:Body>
      <gs:addPersonaRequest>
         <gs:firstName>Марина</gs:firstName>
         <gs:patronymic>Петрівна</gs:patronymic>
         <gs:lastName>Петренко</gs:lastName>
         <gs:gender>female</gs:gender>
         <gs:birthDate>2014-10-11</gs:birthDate>
         <gs:rnokpp>1234567890</gs:rnokpp>
         <gs:unzr>20141011-12345</gs:unzr>
         <gs:pasport>АА123456</gs:pasport>
      </gs:addPersonaRequest>
   </soapenv:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних                         | Значення параметру                                                                                                                        | Обов’язковість |
|:------------------------:|----------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|
|            3             | 	firstName                | 	String, <br/>min=1, <br/>max=128 | 	Ім’я                                                                                                                                     |      	Так      |
|            3             | 	patronymic            | 	String, <br/>min=0,<br/> max=128 | 	По батькові                                                                                                                              |      	Ні       |
|            3             | 	lastName             | 	String, <br/>min=1, <br/>max=128 | 	Прізвище                                                                                                                                 |      	Так      |
|            3             | 	gender              | 	String                           | 	Стать                                                                                                                                    |      	Так      |
|            3             | 	birthDate         | 	String                           | 	Дата народження                                                                                                                          |      	Так      |
|            3             | 	rnokpp              | 	String                           | 	РНОКПП, 10 цифр                                                                                                                          |      	Так      |
|            3             | 	unzr                | 	String                           | 	УНЗР, 14 символів в форматі YYYYMMDD-XXXXC, де  YYYY – рік, MM – місяць, DD – день,  XXXXC – 5 цифр                                      |      Так       |
|            3             | 	passport      | 	String                           | 	Номер паспорта.<br/> **Для старого формату** – перші 2 символи - літери від А до Я, пробіл, 6 цифр.<br/> **Для нового формату** – 9 цифр |      	Так      |


**Відповідь** у разі успішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
      <ns2:addPersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>true</ns2:status>
            <ns2:descr>Persona added successfully</ns2:descr>
            <ns2:result>{"firstName":"Марина","lastName":"Петренко","patronymic":"Петрівна","rnokpp":"1234567890","gender":"female","unzr":"20141011-12345","pasport":"АА123456","id":153,"birthDate":"2014-10-11","isChecked":false,"age":11}</ns2:result>
         </ns2:answerXml>
      </ns2:addPersonaResponse>

```
де:
| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних   | Значення параметру       | Обов’язковість |
|:------------------------:|----------------------|-------------|--------------------------|:--------------:|
|            3             | ns2:status               | String     | Статус запиту            |      Так       |
|            3             | ns2:descr                | String      | Відповідь сервісу        |      Так       |
|            3             | ns2:result               | String      | Результат обробки запиту |      Так       |


Відповідь у разі не успішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
   <SOAP-ENV:Body>
      <ns2:addPersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>false</ns2:status>
            <ns2:descr>Error: could not execute statement [ERROR: duplicate key value violates unique constraint "uk7x0f32nudq9bf6tbp86oh8vyk"
  Detail: Key (rnokpp)=(1234567890) already exists.] [insert into persona (checked_request,birth_date,first_name,gender,is_checked,last_name,pasport,patronymic,rnokpp,unzr,id) values (?,?,?,?,?,?,?,?,?,?,?)]; SQL [insert into persona (checked_request,birth_date,first_name,gender,is_checked,last_name,pasport,patronymic,rnokpp,unzr,id) values (?,?,?,?,?,?,?,?,?,?,?)]; constraint [uk7x0f32nudq9bf6tbp86oh8vyk]</ns2:descr>
         </ns2:answerXml>
      </ns2:addPersonaResponse>
   </SOAP-ENV:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних   | Значення параметру       | Обов’язковість |
|:------------------------:|----------------------|-------------|--------------------------|:--------------:|
|            5             | ns2:status           | String      | Статус запиту            |      Так       |
|            5             | ns2:descr            | String      | Відповідь сервісу        |      Так       |

### **Get Person List**
Повертає записи з БД відповідно до заданих параметрів.

|  Код сервісу   | Базова URL                       |
|:--------------:|----------------------------------|
| getPersonaList | http://your-server-ip:8080/ws    |

**Параметри запиту** виглядають наступним чином:
```
<soapenv:Body>
      <gs:getPersonaListRequest/>
   </soapenv:Body>
```

**Відповідь** у разі успішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
  <SOAP-ENV:Body>
      <ns2:getPersonaListResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:personaXml>
            <ns2:id>3</ns2:id>
            <ns2:firstName>Арсен</ns2:firstName>
            <ns2:patronymic>Святославович</ns2:patronymic>
            <ns2:lastName>Євтушок</ns2:lastName>
            <ns2:age>93</ns2:age>
            <ns2:birthDate>1932-03-03</ns2:birthDate>
            <ns2:rnokpp>3404106605</ns2:rnokpp>
            <ns2:unzr>19320303-80660</ns2:unzr>
            <ns2:pasport>ME591275</ns2:pasport>
            <ns2:isChecked>false</ns2:isChecked>
         </ns2:personaXml>
         <ns2:personaXml>
            <ns2:id>153</ns2:id>
            <ns2:firstName>Марина</ns2:firstName>
            <ns2:patronymic>Петрівна</ns2:patronymic>
            <ns2:lastName>Петренко</ns2:lastName>
            <ns2:gender>female</ns2:gender>
            <ns2:age>11</ns2:age>
            <ns2:birthDate>2014-10-11</ns2:birthDate>
            <ns2:rnokpp>1234567890</ns2:rnokpp>
            <ns2:unzr>20141011-12345</ns2:unzr>
            <ns2:pasport>АА123456</ns2:pasport>
            <ns2:isChecked>false</ns2:isChecked>
         </ns2:personaXml>
      </ns2:getPersonaListResponse>
   </SOAP-ENV:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних                         | Значення параметру                                                                                                                        | Обов’язковість |
|:------------------------:|----------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|
|            5             | 	firstName                | 	String, <br/>min=1, <br/>max=128 | 	Ім’я                                                                                                                                     |      	Так      |
|            5             | 	patronymic            | 	String, <br/>min=0,<br/> max=128 | 	По батькові                                                                                                                              |      	Ні       |
|            5             | 	lastName             | 	String, <br/>min=1, <br/>max=128 | 	Прізвище                                                                                                                                 |      	Так      |
|            5             | 	age             | 	Boolean | 	Прізвище                                                                                                                                 |      	Так      |
|            5             | 	gender              | 	String                           | 	Стать                                                                                                                                    |      	Так      |
|           5             | 	birthDate         | 	String                           | 	Дата народження                                                                                                                          |      	Так      |
|            5             | 	rnokpp              | 	String                           | 	РНОКПП, 10 цифр                                                                                                                          |      	Так      |
|            5             | 	unzr                | 	String                           | 	УНЗР, 14 символів в форматі YYYYMMDD-XXXXC, де  YYYY – рік, MM – місяць, DD – день,  XXXXC – 5 цифр                                      |      Так       |
|            5             | 	passport      | 	String                           | 	Номер паспорта.<br/> **Для старого формату** – перші 2 символи - літери від А до Я, пробіл, 6 цифр.<br/> **Для нового формату** – 9 цифр |      	Так      |
|            5             | 	isChecked      | 	String                           | 	Параметр для демонстрації асинхронного режиму роботи вебсервісу |      	Так      |

### **Get Persona By Parametr**

Повертає записи з БД відповідно до заданих параметрів.

|Параметр         |  Код сервісу              | Базова URL                       |
|-----------------|:--------------------------|----------------------------------|
| РНОКПП          | getPersona                | http://your-server-ip:8080/ws    |
| Ім'я            | getPersonaListByFirstName | http://your-server-ip:8080/ws    |
| Прізвище        | getPersonaListByLastName  | http://your-server-ip:8080/ws    |
| Дата народження | getPersonaListByBirthDate | http://your-server-ip:8080/ws    |
| Номер паспорту  | getPersonaListByPassport  | http://your-server-ip:8080/ws    |
| УНЗР            | getPersonaListByUNZR      | http://your-server-ip:8080/ws    |

В залежносты від обраного методу **параметри запиту** виглядають наступним чином:
```
   <soapenv:Body>
      <gs:getPersonaRequest>
         <gs:rnokpp>1234567890</gs:rnokpp>
      </gs:getPersonaRequest>
   </soapenv:Body
```

або:

```
   <soapenv:Body>
      <gs:getPersonaListByFirstNameRequest>
         <gs:firstName>Марина</gs:firstName>
      </gs:getPersonaListByFirstNameRequest>
   </soapenv:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних                         | Значення параметру                                                                                                                        | Обов’язковість |
|:------------------------:|----------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|
|            4             | 	firstName                | 	String, <br/>min=1, <br/>max=128 | 	Ім’я                                                                                                                                     |      	Так, при виборі відповідного методу пошуку      |
|            4             | 	lastName             | 	String, <br/>min=1, <br/>max=128 | 	Прізвище                                                                                                                                 |      	Так, при виборі відповідного методу пошуку     |
|           4             | 	birthDate         | 	String                           | 	Дата народження                                                                                                                          |      	Так, при виборі відповідного методу пошуку      |
|            4             | 	rnokpp              | 	String                           | 	РНОКПП, 10 цифр                                                                                                                          |      	Так, при виборі відповідного методу пошуку      |
|            4             | 	unzr                | 	String                           | 	УНЗР, 14 символів в форматі YYYYMMDD-XXXXC, де  YYYY – рік, MM – місяць, DD – день,  XXXXC – 5 цифр                                      |      Так, при виборі відповідного методу пошуку       |
|            4             | 	passport      | 	String                           | 	Номер паспорта.<br/> **Для старого формату** – перші 2 символи - літери від А до Я, пробіл, 6 цифр.<br/> **Для нового формату** – 9 цифр |      	Так, при виборі відповідного методу пошуку      |

Відповідь у разі успішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
   <SOAP-ENV:Body>
      <ns2:getPersonaListResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:personaXml>
            <ns2:id>153</ns2:id>
            <ns2:firstName>Марина</ns2:firstName>
            <ns2:patronymic>Петрівна</ns2:patronymic>
            <ns2:lastName>Петренко</ns2:lastName>
            <ns2:gender>female</ns2:gender>
            <ns2:age>11</ns2:age>
            <ns2:birthDate>2014-10-11</ns2:birthDate>
            <ns2:rnokpp>1234567890</ns2:rnokpp>
            <ns2:unzr>20141011-12345</ns2:unzr>
            <ns2:pasport>АА123456</ns2:pasport>
            <ns2:isChecked>false</ns2:isChecked>
         </ns2:personaXml>
      </ns2:getPersonaListResponse>
   </SOAP-ENV:Body>

```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних                         | Значення параметру                                                                                                                     | Обов’язковість |
|:------------------------:|----------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|
|            5             | 	firstName                | 	String, <br/>min=1, <br/>max=128 | 	Ім’я                                                                                                                                     |      	Так      |
|            5             | 	patronymic            | 	String, <br/>min=0,<br/> max=128 | 	По батькові                                                                                                                              |      	Ні       |
|            5             | 	lastName             | 	String, <br/>min=1, <br/>max=128 | 	Прізвище                                                                                                                                 |      	Так      |
|            5             | 	age             | 	Boolean | 	Прізвище                                                                                                                                 |      	Так      |
|            5             | 	gender              | 	String                           | 	Стать                                                                                                                                    |      	Так      |
|           5             | 	birthDate         | 	String                           | 	Дата народження                                                                                                                          |      	Так      |
|            5             | 	rnokpp              | 	String                           | 	РНОКПП, 10 цифр                                                                                                                          |      	Так      |
|            5             | 	unzr                | 	String                           | 	УНЗР, 14 символів в форматі YYYYMMDD-XXXXC, де  YYYY – рік, MM – місяць, DD – день,  XXXXC – 5 цифр                                      |      Так       |
|            5             | 	passport      | 	String                           | 	Номер паспорта.<br/> **Для старого формату** – перші 2 символи - літери від А до Я, пробіл, 6 цифр.<br/> **Для нового формату** – 9 цифр |      	Так      |
|            5             | 	isChecked      | 	String                           | 	Параметр для демонстрації асинхронного режиму роботи вебсервісу |      	Так      |

Відповідь у разі не успішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
 <SOAP-ENV:Body>
      <ns2:getPersonaListResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service"/>
   </SOAP-ENV:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру        | Тип даних   | Значення параметру       | Обов’язковість |
|:------------------------:|-----------------------------|-------------|--------------------------|:--------------:|
|            3             | ns2:getPersonaListResponse  | String      | Відповідь сервісу        |      Так       |

### **Update Personа**

Вносить зміни для певного запису з БД про певну особу.

|  Код сервісу   | Базова URL                       |
|:--------------:|----------------------------------|
| updatePersona  | http://your-server-ip:8080/ws    |

**Параметри запиту** виглядають наступним чином:

```
   <soapenv:Body>
      <gs:updatePersonaRequest>
         <gs:firstName>Мари</gs:firstName>
         <gs:patronymic>Петрівна</gs:patronymic>
         <gs:lastName>Петренко</gs:lastName>
         <gs:gender>female</gs:gender>
         <gs:birthDate>2014-10-11</gs:birthDate>
         <gs:rnokpp>1234567890</gs:rnokpp>
         <gs:unzr>20141011-12345</gs:unzr>
         <gs:pasport>АА123456</gs:pasport>
      </gs:addPersonaRequest>
   </soapenv:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних                         | Значення параметру                                                                                                                        | Обов’язковість |
|:------------------------:|----------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|
|            3             | 	firstName                | 	String, <br/>min=1, <br/>max=128 | 	Ім’я                                                                                                                                     |      	Так      |
|            3             | 	patronymic            | 	String, <br/>min=0,<br/> max=128 | 	По батькові                                                                                                                              |      	Ні       |
|            3             | 	lastName             | 	String, <br/>min=1, <br/>max=128 | 	Прізвище                                                                                                                                 |      	Так      |
|            3             | 	gender              | 	String                           | 	Стать                                                                                                                                    |      	Так      |
|            3             | 	birthDate         | 	String                           | 	Дата народження                                                                                                                          |      	Так      |
|            3             | 	rnokpp              | 	String                           | 	РНОКПП, 10 цифр                                                                                                                          |      	Так      |
|            3             | 	unzr                | 	String                           | 	УНЗР, 14 символів в форматі YYYYMMDD-XXXXC, де  YYYY – рік, MM – місяць, DD – день,  XXXXC – 5 цифр                                      |      Так       |
|            3             | 	passport      | 	String                           | 	Номер паспорта.<br/> **Для старого формату** – перші 2 символи - літери від А до Я, пробіл, 6 цифр.<br/> **Для нового формату** – 9 цифр |      	Так      |

**Важливо!** Обмеження сервісу – не можна міняти поле **rnokpp**!

**Відповідь** у разі успішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
    <SOAP-ENV:Body>
      <ns2:updatePersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>true</ns2:status>
            <ns2:descr>Persona with RNOKPP 1234567890 updated successfully</ns2:descr>
         </ns2:answerXml>
      </ns2:updatePersonaResponse>
   </SOAP-ENV:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних   | Значення параметру       | Обов’язковість |
|:------------------------:|----------------------|-------------|--------------------------|:--------------:|
|            5             | ns2:status           | String      | Статус запиту            |      Так       |
|            5             | ns2:descr            | String      | Відповідь сервісу        |      Так       |

**Відповідь** у разі неуспішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
   <SOAP-ENV:Body>
      <ns2:updatePersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>false</ns2:status>
            <ns2:descr>Персона з РНОКПП 1234567891 не знайдена в БД!</ns2:descr>
         </ns2:answerXml>
      </ns2:updatePersonaResponse>
   </SOAP-ENV:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних   | Значення параметру       | Обов’язковість |
|:------------------------:|----------------------|-------------|--------------------------|:--------------:|
|            5             | ns2:status           | String      | Статус запиту            |      Так       |
|            5             | ns2:descr            | String      | Відповідь сервісу        |      Так       |

### **Delete Personа**

Видаляє записи з БД тільки за РНОКПП.

|  Код сервісу   | Базова URL                       |
|:--------------:|----------------------------------|
| deletePersona  | http://your-server-ip:8080/ws    |

**Параметри запиту** виглядають наступним чином:

```
   <soapenv:Body>
      <gs:deletePersonaRequest>
         <gs:rnokpp>1234567890</gs:rnokpp>
      </gs:deletePersonaRequest>
   </soapenv:Body>
```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних                         | Значення параметру                                                                                                                        | Обов’язковість |
|:------------------------:|----------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|
|            4             | 	rnokpp              | 	String                           | 	РНОКПП, 10 цифр                                                                                                                        |      	Так      |

Тіло відповіді у разі успішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
   <SOAP-ENV:Body>
      <ns2:deletePersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>true</ns2:status>
            <ns2:descr/>
            <ns2:result>Персона з РНОКПП: 1234567890 була видалена з БД!</ns2:result>
         </ns2:answerXml>
      </ns2:deletePersonaResponse>
   </SOAP-ENV:Body>

```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру  | Тип даних   | Значення параметру         | Обов’язковість |
|:------------------------:|-----------------------|-------------|----------------------------|:--------------:|
|            5             | ns2:status            | String      | Статус запиту              |      Так       |
|            5             | ns2:descr             | String      | Відповідь сервісу          |      Так       |
|            5             | ns2:result            | String      | Результат обробки запиту   |      Так       |

**Відповідь** у разі неуспішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
  <SOAP-ENV:Body>
      <ns2:deletePersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>false</ns2:status>
            <ns2:descr>Персону з РНОКПП: 1234567890 не було знайдено в БД!</ns2:descr>
         </ns2:answerXml>
      </ns2:deletePersonaResponse>
   </SOAP-ENV:Body>

```
де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних   | Значення параметру       | Обов’язковість |
|:------------------------:|----------------------|-------------|--------------------------|:--------------:|
|            5             | ns2:status           | String      | Статус запиту            |      Так       |
|            5             | ns2:descr            | String      | Відповідь сервісу        |      Так       |

### **Check Personа**

Асинхронний режим роботи вебсервісу, перевірка обраного за РНОКПП запису на протязі 5 хвилин.

|  Код сервісу   | Базова URL                       |
|:--------------:|----------------------------------|
| checkPersona  | http://your-server-ip:8080/ws    |

**Параметри запиту** виглядають наступним чином:

```
   <soapenv:Body>
      <gs:checkPersonaRequest>
         <gs:rnokpp>1234567890</gs:rnokpp>
      </gs:checkPersonaRequest>
   </soapenv:Body>

```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру | Тип даних                         | Значення параметру                                                                                                                        | Обов’язковість |
|:------------------------:|----------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|
|            4             | 	rnokpp              | 	String                           | 	РНОКПП, 10 цифр                                                                                                                        |      	Так      |


Тіло відповіді у разі успішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

- відповідь на перший запит:

```
   <SOAP-ENV:Body>
      <ns2:checkPersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>true</ns2:status>
            <ns2:descr/>
            <ns2:result>Запит на перевірку надіслано успішно!</ns2:result>
         </ns2:answerXml>
      </ns2:checkPersonaResponse>
   </SOAP-ENV:Body>
```

- відповідь на запит який надійшов в процесі обробки:

```
   <SOAP-ENV:Body>
      <ns2:checkPersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>true</ns2:status>
            <ns2:descr/>
            <ns2:result>Перевірка персони ще триває!</ns2:result>
         </ns2:answerXml>
      </ns2:checkPersonaResponse>
   </SOAP-ENV:Body>

```

- відповідь на запит після закінчення обробки (обробка триває протягом 5хв):

```
   <SOAP-ENV:Body>
      <ns2:checkPersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>true</ns2:status>
            <ns2:descr/>
            <ns2:result>Персона перевірена успішно!</ns2:result>
         </ns2:answerXml>
      </ns2:checkPersonaResponse>
   </SOAP-ENV:Body>

```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру  | Тип даних   | Значення параметру         | Обов’язковість |
|:------------------------:|-----------------------|-------------|----------------------------|:--------------:|
|            5             | ns2:status            | String      | Статус запиту              |      Так       |
|            5             | ns2:descr             | String      | Відповідь сервісу          |      Так       |
|            5             | ns2:result            | String      | Результат обробки запиту   |      Так       |

**Відповідь** у разі неуспішного опрацювання запиту (**HTTP Code=200**) виглядатиме наступним чином:

```
   <SOAP-ENV:Body>
      <ns2:checkPersonaResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:answerXml>
            <ns2:status>false</ns2:status>
            <ns2:descr>Unknown error</ns2:descr>
            <ns2:result>Персона з РНОКПП 1234567890 не знайдена в БД!</ns2:result>
         </ns2:answerXml>
      </ns2:checkPersonaResponse>
   </SOAP-ENV:Body>

```

де:

| Рівень <br/> вкладеності | Назва <br/>параметру  | Тип даних   | Значення параметру         | Обов’язковість |
|:------------------------:|-----------------------|-------------|----------------------------|:--------------:|
|            5             | ns2:status            | String      | Статус запиту              |      Так       |
|            5             | ns2:descr             | String      | Відповідь сервісу          |      Так       |
|            5             | ns2:result            | String      | Результат обробки запиту   |      Так       |

##
Матеріали створено за підтримки проєкту міжнародної технічної допомоги «Підтримка ЄС цифрової трансформації України (DT4UA)».
