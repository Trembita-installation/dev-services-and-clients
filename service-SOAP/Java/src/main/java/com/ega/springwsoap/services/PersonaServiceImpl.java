/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ega.springwsoap.services;

import com.ega.springwsoap.HttpRequestUtils;
import com.ega.springwsoap.interfaces.PersonaInterface;
import com.ega.springwsoap.models.Answer;
import com.ega.springwsoap.models.LogRecord;
import com.ega.springwsoap.models.Persona;
import com.ega.springwsoap.repository.PersonaRepository;

import io.spring.guides.gs_producing_web_service.AddPersonaRequest;
import io.spring.guides.gs_producing_web_service.AddPersonaResponse;
import io.spring.guides.gs_producing_web_service.AnswerXml;
import io.spring.guides.gs_producing_web_service.CheckPersonaResponse;
import io.spring.guides.gs_producing_web_service.DeletePersonaResponse;
import io.spring.guides.gs_producing_web_service.GetPersonaListResponse;
import io.spring.guides.gs_producing_web_service.PersonaXml;
import io.spring.guides.gs_producing_web_service.UpdatePersonaRequest;
import io.spring.guides.gs_producing_web_service.UpdatePersonaResponse;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.json.JSONArray;
import org.springframework.beans.BeanUtils;



/**
 * Це реалізація сервіса. 
 * 
 */
 //Ця анотація вказує SPRING що данний клас використовується як сервіс
@Service
//Ця анотація відноситься до компоненту Lombok. Вона допомогає створити усі конструктори класів та перемених яки відносятся до данного класу.
//Тут він потрібен для того, щоб ініціалізувати PersonaRepository repository і таким чином включити його в область видимості фреймворка SPRING
//(дивись в документаціі к фреймворку "впровадження залежностей через конструктор")
@AllArgsConstructor
//@Primary
public class PersonaServiceImpl implements PersonaInterface{

    //задаемо константу яка належить до інтерфейсу репозіторія та дозволяє працювати з ним.
    private final PersonaRepository repository;
    private final LogRecordService logService;
    //Ця анотація означає, що нам треба перевизначити цю процедуру/функцію
    //Спочатку дана функція задається в інтерфейсі класу, тут ми її перевизначаємо та реалізуємо.
    //Докладніше https://www.baeldung.com/java-override
    @Override
    //Функція яка повертає усіх людей з бази даних.
    public GetPersonaListResponse showAllPersons() {
        // спочатку создаємо клас Відповідь - який буде містити в себе результати запиту.
          Answer ans;
          //це конструктор класу за допомогою бібліотекі Lombok
          ans = Answer.builder().status(Boolean.FALSE).descr("Unknown error").build();
          GetPersonaListResponse response = new GetPersonaListResponse();
          
          //реалізацію функції обгортаємо в спробу/виключення
          try{
            var result = repository.findAll();      //визиваемо SELECT з бази даних
            List <Persona> persons;

            persons = repository.findAll();
            persons.forEach(persona -> response.getPersonaXml().add((PersonaXml) persona.toXML()));
            
            //якщо визов функції не перервався помилкою, то вважаємо його успішним, та записуемо в Статус відповіді
            ans.setStatus(Boolean.TRUE);            
            ans.setDescr("");   //В описі відповіді вказуемо що запит успішний.
            JSONArray arr = new JSONArray();
            result.forEach(persona -> arr.put(persona.toJSON()));
            ans.setResult(arr.toString());       //Тут результат відповіді.

          }catch (Exception ex){                    //якщо помилка
              ans.setDescr(ex.getMessage());        //надаємо опис помилки
          }

          //записуємо лог
          writeLog(ans);
          return response;           //повертаємо результат до контролера.
    }

    //Ця анотація означає, що нам треба перевизначити цю процедуру/функцію
    //Спочатку дана функція задається в інтерфейсі класу, тут ми її перевизначаємо та реалізуємо.
    //Докладніше https://www.baeldung.com/java-override
    @Override
    //Функція додає нову персону до бази данних
    public AddPersonaResponse addPersona(AddPersonaRequest request) {
            Answer ans;
            ans = Answer.builder().status(Boolean.FALSE).descr("Unknown error").build();
            AddPersonaResponse response = new AddPersonaResponse();
            PersonaXml personaXml = new PersonaXml();

            BeanUtils.copyProperties(request, personaXml);
            Persona persona = new Persona(personaXml);
            try {
                repository.save(persona);
                ans.setStatus(Boolean.TRUE);
                ans.setDescr("Персону додано успішно!");
                ans.setResult(persona.toJSON().toString());       //Тут результат відповіді.
            }catch(Exception ex){
                ans.setDescr("Error: "+ex.getMessage());
            }
            response.setAnswerXml(ans.toXml());

            //записуємо лог
            writeLog(ans);
  
            return response;           //повертаємо результат до контролера.
    }

    //Ця анотація означає, що нам треба перевизначити цю процедуру/функцію
    //Спочатку дана функція задається в інтерфейсі класу, тут ми її перевизначаємо та реалізуємо.
    //Докладніше https://www.baeldung.com/java-override
    @Override
    //@Transactional
    //Функція оновлює дані персони
    public UpdatePersonaResponse updatePersona(UpdatePersonaRequest request) {
            Answer ans = Answer.builder().status(Boolean.FALSE).descr("Unknown error").build();
            UpdatePersonaResponse response = new UpdatePersonaResponse();
            Persona persona;
            
            try {
                persona = repository.findByRnokpp(request.getRnokpp());
                if(persona==null){
                    ans.setResult("Персону з РНОКПП "+request.getRnokpp()+" не знайдено в БД");
                    ans.setDescr("Персону з РНОКПП "+request.getRnokpp()+" не знайдено в БД");
                }else{
                    BeanUtils.copyProperties(request, persona);
                    repository.save(persona);
                    ans.setStatus(Boolean.TRUE);
                    ans.setResult("Персона з РНОКПП "+request.getRnokpp()+" успішно оновлена");
                    ans.setDescr("Персона з РНОКПП "+request.getRnokpp()+" успішно оновлена");
                }
            }catch(Exception ex){
                ans.setDescr("Error: "+ex.getMessage());
            }
            response.setAnswerXml(ans.toXml());

         
            //записуємо лог
            writeLog(ans);
            return response;           //повертаємо результат до контролера.
    }

    //Ця анотація означає, що нам треба перевизначити цю процедуру/функцію
    //Спочатку дана функція задається в інтерфейсі класу, тут ми її перевизначаємо та реалізуємо.
    //Докладніше https://www.baeldung.com/java-override
    @Override
    //Видалення запису з БД повинно бути транзакційним. Ця анотація робить це.
    @Transactional
    //Видаляє персону по РНОКПП
    public DeletePersonaResponse deletePersona(String rnokpp) {
            Answer ans;
            ans = Answer.builder().status(Boolean.FALSE).descr("Невідома помилка").build();
            DeletePersonaResponse response = new DeletePersonaResponse();


            try{
                Persona persona = repository.findByRnokpp(rnokpp);
                if(persona!=null){
                    repository.deleteByRnokpp(rnokpp);
                    //якщо визов функції не перервався помилкою, то вважаємо його успішним, та записуемо в Статус відповіді
                    ans.setStatus(Boolean.TRUE);
                    ans.setDescr("");   //В описі відповіді вказуемо що запит успішний.
                    ans.setResult("Персона з РНОКПП: "+rnokpp+" була видалена з БД!");  //Тут результат відповіді.
                }else{
                    ans.setDescr("Персону з РНОКПП: "+rnokpp+" не було знайдено в БД!");   //В описі відповіді вказуемо що запит успішний.
                    
                }
            }catch (Exception ex){                    //якщо помилка
                ans.setDescr(ex.getMessage());        //надаємо опис помилки
            }
          response.setAnswerXml((AnswerXml) ans.toXml());
          
           //записуємо лог
           writeLog(ans);
          return response;           //повертаємо результат до контролера.
    }
    
    @Override
    //Функція проставляє признак isCheked для персони
    public Answer checkup(String rnokpp) {
          Answer ans;
          ans = Answer.builder().status(Boolean.FALSE).descr("Unknown error").build();
          try{
            Persona persona = repository.findByRnokpp(rnokpp);
            if(persona == null){
                ans.setResult("Персона з РНОКПП "+rnokpp+" не знайдена в БД!");       //Тут результат відповіді.                
                ans.setDescr("Персона з РНОКПП "+rnokpp+" не знайдена в БД!");   //В описі відповіді вказуемо що запит не успішний.
            }else{
                ans.setStatus(Boolean.TRUE);            
                ans.setDescr("");   
                persona.setIsChecked(Boolean.TRUE);
                repository.save(persona);
                //якщо визов функції не перервався помилкою, то вважаємо його успішним, та записуемо в Статус відповіді
                ans.setResult("Персона перевірена!");       //Тут результат відповіді.
                
            }
          }catch (Exception ex){                    //якщо помилка
              ans.setDescr(ex.getMessage());        //надаємо опис помилки
          }
          
           //записуємо лог
           writeLog(ans);
          return ans;           //повертаємо результат до контролера.
    }

    @Override
    //Функція перевіряє поточний статус персони
    public CheckPersonaResponse checkPersona(String rnokpp) {
        CheckPersonaResponse response= new CheckPersonaResponse();
        Answer ans;
        ans = Answer.builder().status(Boolean.FALSE).descr("Unknown error").build();
        try{
            Persona persona = repository.findByRnokpp(rnokpp);
            if(persona == null){
                ans.setStatus(Boolean.FALSE);            
                ans.setResult("Персона з РНОКПП "+rnokpp+" не знайдена в БД!");       //Тут результат відповіді.                
            }else if(persona.getIsChecked()==true){
                ans.setStatus(Boolean.TRUE);            
                ans.setResult("Persona is checked!");       //Тут результат відповіді.

            }else {
                LocalDateTime dt = LocalDateTime.now();
                LocalDateTime dr = persona.getCheckedRequest();
                ans.setStatus(Boolean.TRUE);            
                ans.setDescr("");            
                if((dr==null)||(dr.getYear()==1)){
                    persona.setCheckedRequest(dt);
                    repository.save(persona);
                    ans.setResult("Запит на перевірку надіслано успішно!");       //Тут результат відповіді.
                }else{
                    dr = dr.plusMinutes(5);
                    if (dt.isAfter(dr)){                    
                        persona.setIsChecked(Boolean.TRUE);
                        repository.save(persona);
                        ans.setResult("Персона перевірена успішно!");       //Тут результат відповіді.
                    }else{
                        ans.setResult("Перевірка персони ще триває!");       //Тут результат відповіді.
                    }

                }
            }
        }catch (Exception ex){                    //якщо помилка
            ans.setDescr(ex.getMessage());        //надаємо опис помилки
        }
        
        System.out.println(ans.toString());
        response.setAnswerXml(ans.toXml());
        //запис лога
        writeLog(ans);
        return response;           //повертаємо результат до контролера.
    }

    //запис лога
    private void writeLog(Answer ans){
    
        LogRecord log = new LogRecord();
        
        log.setIp(HttpRequestUtils.getClientIpAddress());
        log.setHttpMethod(HttpRequestUtils.getHttpMethod());
        log.setError(!ans.getStatus());
        log.setHeaders(HttpRequestUtils.getHeaders());
        log.setResource(HttpRequestUtils.getPath());
        log.setResult(ans);
        log.setDescr(ans.getDescr());
        log.setBody("");
        
        
        logService.addRecord(log);
        
    }

    //Ця анотація означає, що нам треба перевизначити цю процедуру/функцію
    //Спочатку дана функція задається в інтерфейсі класу, тут ми її перевизначаємо та реалізуємо.
    //Докладніше https://www.baeldung.com/java-override
    @Override
    //Функція знаходить та повертає персону по його rnokpp
    public GetPersonaListResponse find(String rnokpp) {
        Answer ans;
        ans = Answer.builder().status(Boolean.FALSE).descr("Незрозуміла помилка").build();
        GetPersonaListResponse response = new GetPersonaListResponse();
        Persona persona;
          
        try{
            var result = repository.findByRnokpp(rnokpp);
            if(result==null){
                ans.setDescr("Персона з РНОКПП: "+rnokpp+" не знайдена в БД");   //В описі відповіді вказуемо що запит не успішний.
            }else{
                ans.setStatus(Boolean.TRUE);
                System.out.println(result.toXML().toString());
		response.getPersonaXml().add(result.toXML());
                ans.setDescr("");   //В описі відповіді вказуемо що запит успішний.
                ans.setResult(result.toJSON().toString());       //Тут результат відповіді.
            }
        }catch (Exception ex){                    //якщо помилка
            ans.setStatus(Boolean.FALSE);            
            ans.setDescr(ex.getMessage());        //надаємо опис помилки
        }
          
           //записуємо лог
        writeLog(ans);
        return response;           //повертаємо результат до контролера.
    }
    
    @Override
    //Пошук всіх персон по їх імені
    public GetPersonaListResponse findByFirstName(String firstName) {
        Answer ans;
    //    JSONArray arr = new JSONArray();
        ans = Answer.builder().status(Boolean.FALSE).descr("Невідома помилка").build();
        GetPersonaListResponse response = new GetPersonaListResponse();
          
        try{
            var result = repository.findAllByFirstName(firstName);
            if(result==null){
                ans.setDescr("Персона з іменем: "+firstName+" не знайдена в БД");   //В описі відповіді вказуемо що запит не успішний.
            }else{
                ans.setStatus(Boolean.TRUE);
                result.forEach(persona -> response.getPersonaXml().add((PersonaXml) persona.toXML()));
                ans.setDescr("");   //В описі відповіді вказуемо що запит успішний.
                ans.setResult(response.toString());       //Тут результат відповіді.
            }
        }catch (Exception ex){                    //якщо помилка
            ans.setStatus(Boolean.FALSE);            
            ans.setDescr(ex.getMessage());        //надаємо опис помилки
        }
          
           //записуємо лог
        writeLog(ans);
        return response;           //повертаємо результат до контролера.
    }
    
    @Override
    //пошук всіх персон по початку їх призвища
    public GetPersonaListResponse findByLastName(String lastName) {
          GetPersonaListResponse response = new GetPersonaListResponse();
          Answer ans;
        ans = Answer.builder().status(Boolean.FALSE).descr("Невідома помилка").build();
          try{
            List<Persona> result = repository.findAllByLastName(lastName);
            result.forEach(persona -> response.getPersonaXml().add((PersonaXml) persona.toXML()));
            if(result.isEmpty()){
                System.out.println("Персона з прізвищем: "+lastName+" не знайдена в БД");
                ans.setDescr("Персона з прізвищем: "+lastName+" не знайдена в БД");   //В описі відповіді вказуемо що запит не успішний.
            }else{
                ans.setStatus(Boolean.TRUE);
                ans.setDescr("");   //В описі відповіді вказуемо що запит успішний.
                ans.setResult(Persona.listToJSON(result).toString());       //Тут результат відповіді.
            }
          }catch (Exception ex){                    //якщо помилка
            ans.setStatus(Boolean.FALSE);            
            ans.setDescr(ex.getMessage());        //надаємо опис помилки
          }
          
          //записуем лог
          writeLog(ans);
          return response;           //повертаємо результат до контролера.
    }


    @Override
    public GetPersonaListResponse findByBirthDate(String birthDate) {
          GetPersonaListResponse response = new GetPersonaListResponse();
          Answer ans;
          LocalDate ld;
        ans = Answer.builder().status(Boolean.FALSE).descr("Невідома помилка").build();
          try{
              ld = LocalDate.parse(birthDate);
              
            List<Persona> result = repository.findByBirthDateBetween(ld, ld);
            result.forEach(persona -> response.getPersonaXml().add((PersonaXml) persona.toXML()));
            if(result.isEmpty()){
                ans.setDescr("Персона з датой народження: "+birthDate+" не знайдена в БД");   //В описі відповіді вказуемо що запит не успішний.
            }else{
                ans.setStatus(Boolean.TRUE);
                ans.setDescr("");   //В описі відповіді вказуемо що запит успішний.
                ans.setResult(Persona.listToJSON(result).toString());       //Тут результат відповіді.
            }
          }catch (Exception ex){                    //якщо помилка
            ans.setStatus(Boolean.FALSE);            
            ans.setDescr(ex.getMessage());        //надаємо опис помилки
          }
          
          //записуем лог
          writeLog(ans);
          return response;           //повертаємо результат до контролера.
    }

    @Override
    public GetPersonaListResponse findByPasport(String pasport) {
          GetPersonaListResponse response = new GetPersonaListResponse();
          Answer ans;
        ans = Answer.builder().status(Boolean.FALSE).descr("Невідома помилка").build();
          try{
            List<Persona> result = repository.findAllByPasport(pasport);
            result.forEach(persona -> response.getPersonaXml().add((PersonaXml) persona.toXML()));
            if(result.isEmpty()){
                ans.setDescr("Персона з паспортом: "+pasport+" не знайдена в БД");   //В описі відповіді вказуемо що запит не успішний.
            }else{
                ans.setStatus(Boolean.TRUE);
                ans.setDescr("");   //В описі відповіді вказуемо що запит успішний.
                ans.setResult(Persona.listToJSON(result).toString());       //Тут результат відповіді.
            }
          }catch (Exception ex){                    //якщо помилка
            ans.setStatus(Boolean.FALSE);            
            ans.setDescr(ex.getMessage());        //надаємо опис помилки
          }
          
          //записуем лог
          writeLog(ans);
          return response;           //повертаємо результат до контролера.
    }

    @Override
    public GetPersonaListResponse findByUnzr(String unzr) {
          GetPersonaListResponse response = new GetPersonaListResponse();
          Answer ans;
        ans = Answer.builder().status(Boolean.FALSE).descr("Невідома помилка").build();
          try{
            List<Persona> result = repository.findAllByUnzr(unzr);
            result.forEach(persona -> response.getPersonaXml().add((PersonaXml) persona.toXML()));
            if(result.isEmpty()){
                ans.setDescr("Персона з УНЗР: "+unzr+" не знайдена в БД");   //В описі відповіді вказуемо що запит не успішний.
            }else{
                ans.setStatus(Boolean.TRUE);
                ans.setDescr("");   //В описі відповіді вказуемо що запит успішний.
                ans.setResult(Persona.listToJSON(result).toString());       //Тут результат відповіді.
            }
          }catch (Exception ex){                    //якщо помилка
            ans.setStatus(Boolean.FALSE);            
            ans.setDescr(ex.getMessage());        //надаємо опис помилки
          }
          
          //записуем лог
          writeLog(ans);
          return response;           //повертаємо результат до контролера.
    }

 
    
    

}
