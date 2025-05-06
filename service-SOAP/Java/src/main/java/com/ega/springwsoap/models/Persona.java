package com.ega.springwsoap.models;

import io.spring.guides.gs_producing_web_service.PersonaXml;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import lombok.Data;
import lombok.NonNull;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Цей клас задає модель людини, та його свойства (ім'я, фамілію, дату народження, вік, та т.д.) 
 */
//Ця анотація надає можливість автоматично формувати конструктор класу, та реалізує встановлення та отримання всіх членів класу.
@Data
// The @Builder annotation produces complex builder APIs for your classes.
// Builder lets you automatically produce the code required to have your class be instantiable with code
//@Builder

//Анотація @Entity говорить SPRINGу що цю сутність треба включити до бази данних. 
//Так як у нас анотація відноситься до всього класу - це означає що на базі класу буде створена таблиця в БД
//Докладніше https://www.baeldung.com/jpa-entities
@Entity

//Задає назву таблиці. Якщо ця анотація не існує, то назва таблиці буде дублювати назву класа.
@Table(name="Persona")
public class Persona {
    //Ця анотація вказує, що наступний член класу буде виконувати роль ідентіфікатора в БД    
    @Id
    //Говорить що ідентіфікатор буде генеруватись автоматично
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    private String patronymic;
    private LocalDate birthDate;
    private String gender;
    private String pasport;
    private String unzr;                    //УНЗР
    private Boolean isChecked;              //персона перевірена
    private LocalDateTime CheckedRequest;   //коли був запит на перевірку персони
    
    //Говорить що наступне поле потрібно зробити унікальним в БД
    @Column(unique = true)
    @NonNull
    private String rnokpp;
    //Говорить що це поле буде розраховуватись
    @Transient
    private int age;
    
    public Persona(){
        this.firstName = "";
        this.lastName = "";
        this.patronymic = "";
        this.birthDate = LocalDate.of(1, 1, 1);
        this.pasport = "";
        this.gender = "";
        this.unzr = "";
        this.isChecked = false;
        this.CheckedRequest = LocalDateTime.of(1, 1, 1,0,0,0);
    }

    public Persona(PersonaXml personaXml){
        this.firstName = personaXml.getFirstName();
        this.lastName = personaXml.getLastName();
        this.patronymic = personaXml.getPatronymic();
        XMLGregorianCalendar birthdateXml = personaXml.getBirthDate();
        this.birthDate = LocalDate.of(birthdateXml.getYear(), birthdateXml.getMonth(), birthdateXml.getDay());
        this.pasport = personaXml.getPasport();
        this.rnokpp = personaXml.getRnokpp();
        this.unzr = personaXml.getUnzr();
        this.gender = personaXml.getGender();
        this.isChecked = personaXml.isIsChecked();
        XMLGregorianCalendar chekedRequest = personaXml.getCheckedRequest();
        if(chekedRequest!=null){
            this.CheckedRequest = LocalDateTime.parse(chekedRequest.toString());
        }
    }

    
    // перевизначення функції отримання возрасту. Отримаєм возраст як різницю кількості років між
    // поточним роком та роком народження.
    public int getAge(){
        if((birthDate == null)||(birthDate==LocalDate.of(1, 1, 1))){
            return 0;
        }else return LocalDate.now().getYear() - birthDate.getYear();
    }

    //метод який перетворює персону в JSON об'єкт
    public JSONObject toJSON(){
        JSONObject jsData=new JSONObject();
        jsData.put("id",getId());
        jsData.put("firstName",getFirstName());
        jsData.put("lastName",getLastName());
        jsData.put("patronymic",getPatronymic());
        jsData.put("gender",getGender());
        jsData.put("unzr",getUnzr());
        jsData.put("rnokpp",getRnokpp());
        jsData.put("pasport",getPasport());
        jsData.put("age",getAge());
        jsData.put("birthDate",getBirthDate());
        jsData.put("isChecked",getIsChecked());
        jsData.put("CheckedRequest",getCheckedRequest());
        
        return jsData;
    }  
    
    //метод який перетворюе список персон в масив JSON
    public static JSONArray listToJSON(List <Persona> personsList){
        JSONArray persons = new JSONArray(personsList);
        
        return persons;
    } 
    
    //Метод який перевіряє персону на правильну заповненність усіх полів
    public static Answer isValid(Persona persona){
        //создаємо об'єкт класу відповідь
        Answer ret = Answer.builder().status(true).build();
        
        //Валідуємо ім'я (має містити тількі велики та маленькі літери, апостроф та дефіс)
        ret = isValidStr(persona.getFirstName(),"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-'абвгдеєжзійклмнопрстуфхцчшщиьюяАБВГДЕЄЖЗІЙКЛМНОПРСТУФХЦЧШЩИЬЮЯ",0);
        if(!ret.getStatus())return ret;
        
        //Валідуємо призвіще (має містити тількі велики та маленькі літери, апостроф та дефіс)
        ret = isValidStr(persona.getLastName(),"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-'абвгдеєжзійклмнопрстуфхцчшщиьюяАБВГДЕЄЖЗІЙКЛМНОПРСТУФХЦЧШЩИЬЮЯ",0);
        if(!ret.getStatus())return ret;

        //Валідуємо по-батькові (має містити тількі велики та маленькі літери, апостроф та дефіс)
        ret = isValidStr(persona.getPatronymic(),"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-'абвгдеєжзійклмнопрстуфхцчшщиьюяАБВГДЕЄЖЗІЙКЛМНОПРСТУФХЦЧШЩИЬЮЯ",0);
        if(!ret.getStatus())return ret;
        
        //Валідуємо РНОКПП (має містити тількі 10 цифр)
        ret = isValidStr(persona.getRnokpp(),"0123456789",10);
        if(!ret.getStatus())return ret;

        //Валідуємо паспорт (може бути або цифровий, або тільки перши 2 літери + 6 цифр)
        ret = isValidPasport(persona.getPasport());
        if(!ret.getStatus())return ret;

        //Валідуємо УНЗР (може двох варіантів, або тільки цифри, або 8 цифр + дефіс + ще 5 цифр)
        ret = isValidUnzr(persona.getUnzr());
        
        return ret;
    }

    private static Answer isValidPasport(String checkStr){
        Answer ret = Answer.builder().status(true).build();

        if((checkStr==null)||(checkStr==""))return ret;
        
        switch(checkStr.length()){
            case 9-> {
                String allowedStr = "0123456789";

                for(int i=0;i < checkStr.length();i++){
                    if(!allowedStr.contains(checkStr.subSequence(i, i+1))){
                        ret.setStatus(false);
                        ret.setDescr(checkStr+" містить неприпустимі символи! '"+checkStr.subSequence(i, i+1)+"'");
                        return ret;
                    }
                }
            }
            case 8-> {
                String allowedStr = "abcdefghijklmnopqrstuvwxyz";

                for(int i=0;i < 2;i++){
                    if(!allowedStr.contains(checkStr.toLowerCase().subSequence(i, i+1))){
                        ret.setStatus(false);
                        ret.setDescr(checkStr+" містить неприпустимі символи! '"+checkStr.subSequence(i, i+1)+"'");
                        return ret;
                    }
                }
                
                allowedStr = "0123456789";
                
                for(int i=2;i < checkStr.length();i++){
                    if(!allowedStr.contains(checkStr.subSequence(i, i+1))){
                        ret.setStatus(false);
                        ret.setDescr(checkStr+" містить неприпустимі символи! '"+checkStr.subSequence(i, i+1)+"'");
                        return ret;
                    }
                }
            }
            default -> {
                ret.setStatus(false);
                ret.setDescr(checkStr+" містить неприпустиму кількість символів '"+checkStr.length()+"'");
            }
            
        }
        
        return ret;
    }
    
    private static Answer isValidUnzr(String checkStr){
        Answer ret = Answer.builder().status(true).build();

        if((checkStr==null)||(checkStr==""))return ret;
 
        switch(checkStr.length()){
            case 13-> {
                String allowedStr = "0123456789";

                for(int i=0;i < checkStr.length();i++){
                    if(!allowedStr.contains(checkStr.subSequence(i, i+1))){
                        ret.setStatus(false);
                        ret.setDescr(checkStr+" містить неприпустимі символи! '"+checkStr.subSequence(i, i+1)+"'");
                        return ret;
                    }
                }
            }
            case 14-> {
                String allowedStr = "0123456789";

                for(int i=0;i < 8;i++){
                    if(!allowedStr.contains(checkStr.toLowerCase().subSequence(i, i+1))){
                        ret.setStatus(false);
                        ret.setDescr(checkStr+" містить неприпустимі символи! '"+checkStr.subSequence(i, i+1)+"'");
                        return ret;
                    }
                }
                
                allowedStr = "0123456789";
                
                for(int i=9;i < checkStr.length();i++){
                    if(!allowedStr.contains(checkStr.subSequence(i, i+1))){
                        ret.setStatus(false);
                        ret.setDescr(checkStr+" містить неприпустимі символи! '"+checkStr.subSequence(i, i+1)+"'");
                        return ret;
                    }
                }
            }
            default -> {
                ret.setStatus(false);
                ret.setDescr(checkStr+" містить неприпустиму кількість символів '"+checkStr.length()+"'");
            }
            
        }
        
        return ret;
    }
    
    private static Answer isValidStr(String checkStr, String allowedStr, int maxChars){
        Answer ret = Answer.builder().status(true).build();

        if((checkStr==null)||(checkStr==""))return ret;
        
        if(maxChars == 0){
            maxChars = checkStr.length();
        }else{
            if(checkStr.length()!=maxChars){
                ret.setStatus(false);
                ret.setDescr(checkStr+" містить неприпустиму кількість символів '"+checkStr.length()+"' повинно бути "+maxChars);
                return ret;
            }
        }
        
        for(int i=0;i < maxChars;i++){
            if(!allowedStr.contains(checkStr.subSequence(i, i+1))){
                ret.setStatus(false);
                ret.setDescr(checkStr+" містить неприпустимі символи! '"+checkStr.subSequence(i, i+1)+"'");
                return ret;
            }
        }
                
        return ret;
    }

    public PersonaXml toXML(){
        PersonaXml personaXML = new PersonaXml();
        personaXML.setId(this.getId());
        personaXML.setFirstName(this.getFirstName());
        personaXML.setLastName(this.getLastName());
        personaXML.setPatronymic(this.getPatronymic());

        LocalDate localDate = this.getBirthDate();

        XMLGregorianCalendar xmlGregorianCalendar;
        try {
            xmlGregorianCalendar = DatatypeFactory.newInstance().newXMLGregorianCalendar(localDate.toString());
            personaXML.setBirthDate(xmlGregorianCalendar);
        } catch (DatatypeConfigurationException ex) {
        }

        personaXML.setGender(this.getGender());
        personaXML.setAge(this.getAge());
        personaXML.setRnokpp(this.getRnokpp());
        personaXML.setUnzr(this.getUnzr());
        personaXML.setPasport(this.getPasport());
        
        return personaXML;
    }

}

