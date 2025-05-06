/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ega.springclientsoap.services;

import com.ega.springclientsoap.WebConfig;
import com.ega.springclientsoap.interfaces.SpringClientSoapInterface;
import com.ega.springclientsoap.models.Answer;
import com.ega.springclientsoap.models.AppSettings;
import com.ega.springclientsoap.models.LogRecord;
import com.ega.springclientsoap.models.Persona;
import io.spring.guides.gs_producing_web_service.AddPersonaRequest;
import io.spring.guides.gs_producing_web_service.AddPersonaResponse;
import io.spring.guides.gs_producing_web_service.AnswerXml;
import io.spring.guides.gs_producing_web_service.CheckPersonaRequest;
import io.spring.guides.gs_producing_web_service.CheckPersonaResponse;
import io.spring.guides.gs_producing_web_service.DeletePersonaRequest;
import io.spring.guides.gs_producing_web_service.DeletePersonaResponse;
import io.spring.guides.gs_producing_web_service.GetPersonaListByBirthDateRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListByFirstNameRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListByLastNameRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListByPasportRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListByUnzrRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListResponse;
import io.spring.guides.gs_producing_web_service.GetPersonaRequest;
import io.spring.guides.gs_producing_web_service.PersonaXml;
import io.spring.guides.gs_producing_web_service.UpdatePersonaRequest;
import io.spring.guides.gs_producing_web_service.UpdatePersonaResponse;
import jakarta.xml.soap.SOAPElement;
import jakarta.xml.soap.SOAPException;
import jakarta.xml.soap.SOAPHeader;
import jakarta.xml.soap.SOAPHeaderElement;
import jakarta.xml.soap.SOAPMessage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.TimeZone;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.namespace.QName;
import org.springframework.ws.WebServiceMessage;
import org.springframework.ws.client.core.WebServiceMessageCallback;
import org.springframework.ws.soap.saaj.SaajSoapMessage;


/**
 *
 * @author sa
 */
@Service
public class SpringClientSoapService implements SpringClientSoapInterface{
    private boolean isError = false;
    private String errorDescription = "";
    
    
    @Override
    public String showAll() {
        GetPersonaListRequest request = new GetPersonaListRequest();

        WebConfig webServiceTemplate = new WebConfig();

        GetPersonaListResponse response = (GetPersonaListResponse) SendAndReceive((GetPersonaListRequest) request, "getPersonaList");

        String html = getHtml(response);
        
        return html;

        
    }
    
    public Object SendAndReceive(Object request,String method){
        WebConfig webServiceTemplate = new WebConfig();
        Object response;
        this.isError = false;
        this.errorDescription = "";
        String errorDescription ="";
        
        String uuid =UUID.randomUUID().toString();
        
        try{
            
            response = webServiceTemplate.web.marshalSendAndReceive(AppSettings.SERVER_PATH,request, new WebServiceMessageCallback() {
                @Override
                public void doWithMessage(WebServiceMessage message) {
                try
                    {
                        SOAPMessage soapMessage = ((SaajSoapMessage)message).getSaajMessage();
                        SOAPHeader header = soapMessage.getSOAPHeader();
                        QName qname = new QName("http://x-road.eu/xsd/xroad.xsd","client","xro");
                        SOAPHeaderElement client = header.addHeaderElement(qname);
                        QName iden = new QName("http://x-road.eu/xsd/identifiers","objectType","iden");
                        client.addAttribute(iden, "SUBSYSTEM");

                    for (String key : AppSettings.CLIENT_HEADERS.keySet()) {
                        String value = AppSettings.CLIENT_HEADERS.get(key);

                        SOAPElement clientHeader = client.addChildElement(key, "iden");
                        clientHeader.setTextContent(value);
                    }
  
                    qname = new QName("http://x-road.eu/xsd/xroad.xsd","service","xro");
                    SOAPHeaderElement service = header.addHeaderElement(qname);
                    service.addAttribute(iden, "SERVICE");
                    for (String key : AppSettings.SERVICE_HEADERS.keySet()) {
                        String value = AppSettings.SERVICE_HEADERS.get(key);

                        SOAPElement serviceHeader = service.addChildElement(key, "iden");
                        serviceHeader.setTextContent(value);
                    }
                    //add serviceCode medthod
                    SOAPElement serviceHeader = service.addChildElement("serviceCode", "iden");
                    serviceHeader.setTextContent(method);

                    for (String key : AppSettings.HEADERS.keySet()) {
                        String value = AppSettings.HEADERS.get(key);

                        SOAPHeaderElement soapHeader = header.addHeaderElement(new QName("http://x-road.eu/xsd/xroad.xsd", key, "xro"));
                        soapHeader.setTextContent(value);
                    }

                    SOAPHeaderElement soapHeader = header.addHeaderElement(new QName("http://x-road.eu/xsd/xroad.xsd", "id", "xro"));
                    soapHeader.setTextContent(uuid);
                    
                    
                } catch (SOAPException ex) {
                    System.out.println("Error: "+ex.getMessage());
                    
                }

            }
        
        });
        }catch (Exception ex){
            System.out.println("Error: "+ex.getMessage());
            this.errorDescription = ex.getMessage();
            this.isError = true;
            response = null;
        }
        
        
        //логуемо УІД щоб потім можно було отримати ASIC-контейнер
        loguuid(uuid);
        
        return response;
    }

    @Override
    public String findByRnokpp(String searchData) {
        GetPersonaRequest request = new GetPersonaRequest();
        request.setRnokpp(searchData);


        //request.
        GetPersonaListResponse response = (GetPersonaListResponse) SendAndReceive(request, "getPersona");
        
        String html = getHtml(response);
        
        return html;

        
    }

    @Override
    public String findByFirstName(String firstName) {
        GetPersonaListByFirstNameRequest request = new GetPersonaListByFirstNameRequest();
        request.setFirstName(firstName);
        
        //request.
        GetPersonaListResponse response = (GetPersonaListResponse) SendAndReceive(request, "getPersonaListByFirstName");
        
        String html = getHtml(response);
        
        return html;
    }

    @Override
    public String findByLastName(String lastName) {
        GetPersonaListByLastNameRequest request = new GetPersonaListByLastNameRequest();
        request.setLastName(lastName);
        
        //request.
        GetPersonaListResponse response = (GetPersonaListResponse) SendAndReceive(request,"getPersonaListByLastName");
        
        String html = getHtml(response);
        
        return html;
    }

    @Override
    public String findByBirthDate(String birthDateStr) {
        GetPersonaListByBirthDateRequest request = new GetPersonaListByBirthDateRequest();
        request.setBirthDate(birthDateStr);
        
        //request.
        GetPersonaListResponse response = (GetPersonaListResponse) SendAndReceive(request, "getPersonaListByBirthDate");
        
        String html = getHtml(response);
        
        return html;
    }

    @Override
    public String findByPasport(String pasport) {
        GetPersonaListByPasportRequest request = new GetPersonaListByPasportRequest();
        request.setPasport(pasport);
        
        //request.
        GetPersonaListResponse response = (GetPersonaListResponse) SendAndReceive(request,"getPersonaListByPasport");
        
        String html = getHtml(response);
        
        return html;
    }

    @Override
    public String findByUnzr(String unzr) {
        GetPersonaListByUnzrRequest request = new GetPersonaListByUnzrRequest();
        request.setUnzr(unzr);
        
        //request.
        GetPersonaListResponse response = (GetPersonaListResponse) SendAndReceive(request, "getPersonaListByUnzr");
        
        String html = getHtml(response);
        
        return html;
    }

    @Override
    public Answer savePersona(Persona persona) {
        
        Answer ans = Answer.builder().status(Boolean.FALSE).descr("Unknown error").build();
        XMLGregorianCalendar xmlBirthDate;

        try {
                xmlBirthDate = DatatypeFactory.newInstance().newXMLGregorianCalendar(persona.getBirthDate().toString());
            } catch (DatatypeConfigurationException ex) {
                xmlBirthDate = null;  
        }

        if(persona.getId()==null){ //ADD new persona
            AddPersonaRequest request = new AddPersonaRequest();
            request.setFirstName(persona.getFirstName());
            request.setLastName(persona.getLastName());
            request.setBirthDate(xmlBirthDate);
            request.setGender(persona.getGender());
            request.setRnokpp(persona.getRnokpp());
            request.setPasport(persona.getPasport());
            request.setUnzr(persona.getUnzr());
            request.setPatronymic(persona.getPatronymic());

            //request.
            AddPersonaResponse response = (AddPersonaResponse) SendAndReceive(request,"addPersona");
            AnswerXml ansxml = response.getAnswerXml();
            ans.setStatus(ansxml.isStatus());
            ans.setDescr(ansxml.getDescr());
            ans.setResult(ansxml.getResult());
        }else{  //UPDATE persona
            UpdatePersonaRequest request = new UpdatePersonaRequest();
            request.setFirstName(persona.getFirstName());
            request.setLastName(persona.getLastName());
            request.setBirthDate(xmlBirthDate);
            request.setGender(persona.getGender());
            request.setRnokpp(persona.getRnokpp());
            request.setPasport(persona.getPasport());
            request.setUnzr(persona.getUnzr());
            request.setPatronymic(persona.getPatronymic());
            UpdatePersonaResponse response = (UpdatePersonaResponse) SendAndReceive(request, "updatePersona");
    
            AnswerXml ansxml = response.getAnswerXml();
            ans.setStatus(ansxml.isStatus());
            ans.setDescr(ansxml.getDescr());
            ans.setResult(ansxml.getResult());
        }

        return ans;
    }

    @Override
    public Answer deletePersona(String rnokpp) {
        Answer ans = Answer.builder().status(Boolean.TRUE).descr("Not implemented").build();

        DeletePersonaRequest request = new DeletePersonaRequest();
        request.setRnokpp(rnokpp);
        //request.
        DeletePersonaResponse response = (DeletePersonaResponse) SendAndReceive(request,"deletePersona");
        AnswerXml ansxml = response.getAnswerXml();
        ans.setStatus(ansxml.isStatus());
        ans.setDescr(ansxml.getDescr());
        ans.setResult(ansxml.getResult());

        return ans;
     
    }
    
    @Override
    public Answer checkPersona(String rnokpp) {
        Answer ans = Answer.builder().status(Boolean.TRUE).descr("Not implemented").build();

        CheckPersonaRequest request = new CheckPersonaRequest();
        request.setRnokpp(rnokpp);
        //request.
        CheckPersonaResponse response = (CheckPersonaResponse) SendAndReceive(request,"checkPersona");
        AnswerXml ansxml = response.getAnswerXml();
        ans.setStatus(ansxml.isStatus());
        ans.setDescr(ansxml.getDescr());
        ans.setResult(ansxml.getResult());

        return ans;
        
    }

    @Override
    public Answer checkup(String rnokpp) {
        Answer ans = Answer.builder().status(Boolean.TRUE).descr("Not implemented").build();
        return ans;
    }
    
// Обробка даних, та формування вихідного HTML

    public String getHtml(GetPersonaListResponse response){
        String html = render_template("list_person.html");

        String param = ""+UUID.randomUUID().toString();
        JSONArray jsArray = new JSONArray();

        String body = "";
        
        if(response==null){
            return transformToTable(jsArray,html,param);     //модіфікуємо сторінку list_person.html
        }
        
        for (PersonaXml persona : response.getPersonaXml()) {
            JSONObject jspersona = new JSONObject();
                
                body += "\nІм'я: " +persona.getFirstName()+"\n";
                body += "Прізвище: " +persona.getLastName()+"\n";
                body += "По батькові: " +persona.getPatronymic()+"\n";
                body += "Дата народження: " +persona.getBirthDate()+"\n";
                body += "Вік: " +persona.getAge()+"\n";
                body += "РНОКПП: " +persona.getRnokpp()+"\n";
                body += "УНЗР: " +persona.getUnzr()+"\n";
                body += "Паспорт: " +persona.getPasport()+"\n";
                body += "===============================================================================================\n";
                
                jspersona.put("id", persona.getId());
                jspersona.put("firstName", persona.getFirstName());
                jspersona.put("lastName", persona.getLastName());
                jspersona.put("gender", persona.getGender());
                jspersona.put("birthDate", persona.getBirthDate());
                jspersona.put("age", persona.getAge());
                jspersona.put("rnokpp", persona.getRnokpp());
                jspersona.put("unzr", persona.getUnzr());
                jspersona.put("pasport", persona.getPasport());
                jspersona.put("patronymic", persona.getPatronymic());
                
                jsArray.put(jspersona);
            }
        
        
        String result = transformToTable(jsArray,html,param);     //модіфікуємо сторінку list_person.html
        
        
        
        return result;
    }
    
    public String transformToTable(JSONArray jsArray, String html,String queryId){
        Boolean isSuccess;
        String replaceString = "";
        String result = html;
     
        HashMap log = new HashMap();
        
        log.put("type", "RESPONSE");
        log.put("httpMethod", "GET");
        log.put("uri", AppSettings.SERVER_PATH);
        log.put("resource", "");
        log.put("queryId", queryId);
        //log.put("body", ans.toString());

        //writeLog(log);
        
        String res = "";
        res = jsArray.toString();
        try{
            jsArray = new JSONArray(res);
            for(int i=0;i<jsArray.length();i++){
                JSONObject item = jsArray.getJSONObject(i);

                //System.out.println(item.getString("lastName"));
                replaceString +=  "<tr>\n"
                    +"        <td>"+item.optString("firstName","")+"</td>  <!-- Відображаємо ім'я -->\n"
                    +"        <td>"+item.optString("lastName","")+"</td>  <!-- Відображаємо прізвище -->\n"
                    +"        <td>"+item.optString("patronymic","")+"</td>  <!-- Відображаємо по батькові -->\n"
                    +"        <td>"+item.optString("unzr","")+"</td>  <!-- Відображаємо УНЗР -->\n"
                    +"        <td>\n"
                    +"            <button class=\"btn btn-info\" onclick=\"showDetails("+item.getLong("id")+")\">Детальніше</button>  <!-- Кнопка для відображення деталей -->\n"
                    +"        </td>\n"
                    +"    </tr>\n";

            }
        }
        catch(Exception e){
            System.out.println("Error: "+e.getMessage());
//                    res="[{}]";
        }
                
        
        
        result = result.replaceAll("<!--@PersonsTable-->", replaceString);
        result = result.replaceAll("history.back()", "history.back(0)");
        result = result.replaceAll("@dataToJson", res);
        
        if(this.isError){
            result = result.replaceAll("<!--ONERROR-->", GetErrorBlock(this.errorDescription));
        }
        
        
        return result;
    }

     private String GetErrorBlock(String errorMessage){
        String error = "    <div class=\"container mt-5\">\n" +
            "        <!--<h1 class=\"mb-4\">Помилка</h1>  <!-- Заголовок для сторінки з помилкою -->\n" +
            "        <div class=\"alert alert-danger\" role=\"alert\" >  <!-- Відображаємо повідомлення про помилку у вигляді червоного блоку -->\n" +
            "            <h4 class=\"alert-heading\">Сталась помилка!</h4>  <!-- Заголовок повідомлення про помилку -->\n" +
            "            <p>"+errorMessage+"</p>  <!-- Виводимо повідомлення про помилку з переданого змінного error_message -->\n" +
            "            <hr>\n" +
            "    <!--        <button class=\"btn btn-primary\" onclick=\"history.back()\">Назад</button>  <!-- Кнопка для повернення на попередню сторінку -->\n" +
            "        </div>\n" +
            "    </div>\n";

        return error;
    }
   
    
    public String render_template(String templateName){
 
        // the stream holding the file content
        InputStream is = getClass().getClassLoader().getResourceAsStream("templates/"+templateName);
          
        String html = null;
        try (Scanner scanner = new Scanner(is, StandardCharsets.UTF_8.name())) {
            html = scanner.useDelimiter("\\A").next();

            return html;
        }catch(Exception ex){
            return "Error: File not found";
        }
        
    }
    
        //запис лога
    private void writeLog(HashMap logrecord){
    
        LogRecordService logService = new LogRecordService();
        
        LogRecord log = new LogRecord();
        
        log.setType((String)logrecord.getOrDefault("type",""));
        log.setUri((String)logrecord.getOrDefault("uri",AppSettings.SERVER_PATH));
        log.setHttpMethod((String)logrecord.getOrDefault("httpMethod",""));
        log.setQuieryId((String)logrecord.getOrDefault("queryId",""));
        log.setResource((String)logrecord.getOrDefault("resource",""));
        //log.setHeaders((String)logrecord.getOrDefault("headers"));

        log.setBody((String)logrecord.getOrDefault("body",""));
        
        logService.addRecord(log);
        
    }

    @Override
    public String listCerts() {
        String html;

        html = render_template_files(AppSettings.CERTS_PATH, "list_certs.html");
        
    
        return html;
    }
    
    private String render_template_files(String path, String filename){
        
        String page;
        if(path.equalsIgnoreCase(AppSettings.ASIC_PATH)){
            page = "asic";
        }else{
            page = "cert";
        }
        
        String replaceString = "";
        String html;

        if(new File(path).exists()){
            List<File> files = Stream.of(new File(path).listFiles())
                .filter(file -> !file.isDirectory())
                //.map(File::getName)
                .collect(Collectors.toList());


            for(int i=0;i<files.size();i++){

                Long timestamp = files.get(i).lastModified();
                String fileLastModified = LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), 
                                    TimeZone.getDefault().toZoneId()).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));    

                //службовий файл пропускаємо
                if(files.get(i).getName().equalsIgnoreCase("asic.log")){
                    continue;
                }            

                replaceString +=  "<tr>\n"
                +"    <td> "+files.get(i).getName() +"</td>  <!-- Відображаємо ім'я файлу -->\n"
                +"    <td> "+fileLastModified +"</td>  <!-- Відображаємо дату і час створення файлу -->\n"
                +"    <td>\n"
                +"        <a href=\"/download/"+page+"/"+files.get(i).getName()+"\" class=\"btn btn-primary\">Скачати</a>  <!-- Посилання для завантаження файлу -->\n"
                +"    </td>\n"
                +"    </tr>\n";

            }
        }
        
            html = render_template(filename);
            html = html.replaceAll("<!--@DataTable -->",replaceString);

        return html;
    }

    @Override
    public String downloadFile(String path) {
    
        return "";
    }
    
    private boolean getASIC(String queryId){
        boolean responseResult = false;
        
        InputStream is = null;
        String result = "";

        
        Map<String,String> headers = new HashMap<>();
        headers.put("Content-Type", "application/octet-stream");

        try {
            // Крок 1: Завантажуемо сертіфікат з PEM файла
            KeyStore ks = KeyStore.getInstance("PKCS12");
            ks.load(new FileInputStream(AppSettings.TRUSTSTORE_PATH), AppSettings.TRUSTSTORE_PASSWORD.toCharArray());

            // Крок 2: Створюємо SSL контекст с вашим сертіфікатом
            SSLContext sslContext = SSLContext.getInstance("TLS");
            KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
            kmf.init(ks, AppSettings.TRUSTSTORE_PASSWORD.toCharArray());
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
                @Override
                public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                @Override
                public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                @Override
                public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
            }};

            sslContext.init(kmf.getKeyManagers(), trustAllCerts, new SecureRandom());

            // Крок 3: Конфігуруємо SSL сокет фабрику
            SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            // Створюємо URL з'єднення використовуючи ваш налаштований SSL контекст
            String hostname = AppSettings.SERVER_PATH.toUpperCase();
            if(!hostname.contains("HTTPS")){
                hostname = hostname.replaceAll("HTTP://", "HTTPS://");
            }
            System.out.println(hostname);
            URL url = new URL(hostname+"/signature"+queryId);

            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            if (connection instanceof HttpsURLConnection) {
                ((HttpsURLConnection) connection).setSSLSocketFactory(sslSocketFactory);
            }

          // Set request method to GET
            connection.setRequestMethod("GET");
            
            for(String key: headers.keySet()) {
                connection.setRequestProperty(key, headers.get(key));
              }
            
            // Connect
            int responseCode = connection.getResponseCode();

            
            // Перевіряємо що з'єднання було успішним
            if (responseCode == HttpURLConnection.HTTP_OK) {
                SaveAttachedFile(connection);
                
                responseResult = true;
            } else {
                result = "Request failed. Response code: " + responseCode;
            }
            // Disconnect
            connection.disconnect();
 
            } catch (MalformedURLException ex) {
                result = "ERROR #0001: "+ex.getMessage();
            } catch (IOException ex) {
                result = "ERROR: #0002"+ex.getMessage();
            }   catch (KeyStoreException ex) {
                result = "ERROR: #0003"+ex.getMessage();
            } catch (NoSuchAlgorithmException ex) {
                result = "ERROR: #0004"+ex.getMessage();
            } catch (CertificateException ex) {
                result = "ERROR: #0005"+ex.getMessage();
            } catch (UnrecoverableKeyException ex) {
                result = "ERROR: #0006"+ex.getMessage();
            } catch (KeyManagementException ex) {
                result = "ERROR: #0007"+ex.getMessage();
            }

            System.out.println(result);

        return responseResult;
    }
    
    private void SaveAttachedFile(HttpURLConnection connection){
        BufferedInputStream inputStream = null;
        String result = "";
        try {
            // Отримуємо вхідний стрім з подключення
            inputStream = new BufferedInputStream(connection.getInputStream());
            String filename = connection.getHeaderField("Content-Disposition").replaceAll("filename=", "").replaceAll("\"", "");
            if(filename.isEmpty()){
                LocalDateTime dt = LocalDateTime.now();
                filename = ""+dt.getYear()+dt.getMonth()+dt.getDayOfMonth()+dt.getHour()+dt.getMinute()+dt.getSecond()+dt.getNano()+".zip";
            }   String outputFilePath = AppSettings.ASIC_PATH+"/"+filename;
            // Створюємо вихідний файл
            FileOutputStream fileOutputStream = new FileOutputStream(outputFilePath);
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
            // Read bytes and write to file
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                bufferedOutputStream.write(buffer, 0, bytesRead);
            }   // Close streams
            bufferedOutputStream.close();
            inputStream.close();
            //System.out.println("File saved to: " + outputFilePath);
            
            result = "File saved to: " + outputFilePath;
        } catch (IOException ex) {
                result = "ERROR: #0008"+ex.getMessage();
        } finally {
            try {
                inputStream.close();
            } catch (IOException ex) {
                result = "ERROR: #0008"+ex.getMessage();
            }
        }
        
        System.out.println(result);
    }

    private void loguuid(String uuid){
        
        String xRoadInstance = AppSettings.SERVICE_HEADERS.get("xRoadInstance");
        String memberClass = AppSettings.SERVICE_HEADERS.get("memberClass");
        String memberCode = AppSettings.SERVICE_HEADERS.get("memberCode");
        String subsystemCode = AppSettings.SERVICE_HEADERS.get("subsystemCode");
    
        String queryid = "?queryId="+uuid+"&xRoadInstance="+xRoadInstance+"&memberClass="+memberClass+"&memberCode="+memberCode+"&subsystemCode="+subsystemCode;
        
        BufferedWriter writer;
        try {
            File f = new File(AppSettings.ASIC_PATH+"/asic.log");
            if(f.exists() && !f.isDirectory()) { 
                writer = new BufferedWriter(new FileWriter(AppSettings.ASIC_PATH+"/asic.log", true));
                writer.append(queryid+"\n");
                writer.close();
            }else{
                writer = new BufferedWriter(new FileWriter(AppSettings.ASIC_PATH+"/asic.log", true));
                writer.write(queryid+"\n");
                writer.close();
            }

        } catch (IOException ex) {
            System.out.println("Неможливо зробити запис в asic-файл: "+ex.getMessage());
        }
        
    }

    @Override
    public String listAsic() {
        List<String> queries = readLogQueries();
        boolean wasSuccess = false;
        
        System.out.println("In a container: "+isRunningInsideDocker());
        //якщо клієнт працює в докер, то цю функціональність вимикаєм.
        if(isRunningInsideDocker()){
            String html = render_template_files("","list_files.html");
            html = html.replaceAll("<!--ONERROR-->", GetErrorBlock("Завантаженя ASIC контейнерів не передбачено коли программа працює в Docker!"));
            return html;
        }
        
        for(int i=0; i<queries.size();i++){
            String parametres = queries.get(i);
            boolean isSuccess = getASIC(parametres);
            if (isSuccess){
                wasSuccess = true;
            }
            //в любому випадку, якщо були завантажені хоч які файли, очищаємо файл asic.log щоб не скачувати кожного разу теж саме.
        }
        
        if(wasSuccess){
            DeleteFile(AppSettings.ASIC_PATH+"/asic.log");
        }
        
        String html = render_template_files(AppSettings.ASIC_PATH,"list_files.html");
        
        return html;
    }

    //Після загрузки переліку контейнерів видаляемо файл з неотриманними контейнерами
    private void DeleteFile (String filename){
        File file = new File(filename);

      	// Delete the File
        file.delete();
        
    }
        
    private List <String> readLogQueries(){
        List<String> queries = new ArrayList<String>(); 
        
        BufferedReader br;
        try {
            br = new BufferedReader(new FileReader(AppSettings.ASIC_PATH+"/asic.log"));
            String line = br.readLine();

            while (line != null) {
                queries.add(line);
                line = br.readLine();
            }
            br.close();
        } catch (FileNotFoundException ex) {
            System.out.println("Error: "+ex.getMessage());
        } catch (IOException ex) {
            System.out.println("Error: "+ex.getMessage());
        }
        
        return queries;
    }
    
    public Boolean isRunningInsideDocker() {

        return AppSettings.IS_DOCKER;
    }    
}

