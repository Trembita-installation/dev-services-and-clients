from faker import Faker
import requests
from datetime import datetime
import random
import sys
import xml.etree.ElementTree as ET

if len(sys.argv)>1:
	num_persons = int(sys.argv[1])
else: 	
	num_persons = 1
	print("Usage:\npython3 fakerdb.py XXX\n XXX - number of records that need to be generated to fill the database")
	sys.exit(1)
#print("num=",num_persons)

fake = Faker("uk_UA")

for x in range(num_persons):
	let1 = random.randint(0, 12)
	let2 = random.randint(0, 12)
	sampletext = "ABCEHIKMHOPTX"

	gender = random.randint(0,100)
	
	#print(fake.last_name()+" "+fake.first_name()+" "+fake.middle_name())
	if gender<50:
		lastName = fake.last_name_male()
		firstName = fake.first_name_male()
		middleName = fake.middle_name_male()
	else:
		lastName = fake.last_name_female()
		firstName = fake.first_name_female()
		middleName = fake.middle_name_female()

	print(lastName+" "+firstName+" "+middleName)
		
	birthdate = fake.date_between_dates(date_start="-100y",date_end="-16y");
	
	xmldata = """<x:Envelope xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
		    xmlns:gsp="http://spring.io/guides/gs-producing-web-service">
		    <x:Header/>
		    <x:Body>
			<gsp:addPersonaRequest>
			    <gsp:firstName>"""+firstName+"""</gsp:firstName>
			    <gsp:patronymic>"""+middleName+"""</gsp:patronymic>
			    <gsp:lastName>"""+lastName+"""</gsp:lastName>
			    <gsp:birthDate>"""+birthdate.strftime('%Y-%m-%d')+"""</gsp:birthDate>
			    <gsp:rnokpp>"""+fake.numerify(text = '##########')+"""</gsp:rnokpp>
			    <gsp:unzr>"""+birthdate.strftime('%Y%m%d')+fake.numerify(text = '-#####')+"""</gsp:unzr>
			    <gsp:pasport>"""+sampletext[let1]+sampletext[let2]+fake.bothify(text = '######')+"""</gsp:pasport>
			</gsp:addPersonaRequest>
		    </x:Body>
		</x:Envelope>"""


	#print(xmldata)
	
	url = "http://localhost:8080/ws"

	headers = {'Content-Type': 'text/xml; charset=utf-8'} # set what your server accepts
	try:
		x= requests.post(url, data = xmldata.encode('utf-8'), headers=headers)
		#print("Answer: "+x.text)
	except ConnectionRefusedError:
		print("Error connect to Webservice! 1")	
		sys.exit(-1)
	except ConnectionError:
		print("Error connect to Webservice! 2")
		sys.exit(-1)
	except Exception as e:
		print("Error connect to Webservice! Exception: ",e)
		sys.exit(-1)
			
else:
	print("Наповнення бази завершено!")
	
	
