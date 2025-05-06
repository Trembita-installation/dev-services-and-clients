/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ega.springclientsoap.controllers;

import com.ega.springclientsoap.interfaces.SpringClientSoapInterface;
import com.ega.springclientsoap.models.Answer;
import com.ega.springclientsoap.models.AppSettings;
import com.ega.springclientsoap.models.Persona;
import com.ega.springclientsoap.services.SpringClientSoapService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Scanner;
import org.json.JSONObject;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author sa
 */

@RestController
public class SpringClientSoapController {
        private final ObjectMapper mapper;
        private final SpringClientSoapInterface service;
        
        
  	public SpringClientSoapController(ObjectMapper objectMapper) {
		this.mapper = objectMapper;
                this.service = new SpringClientSoapService(); 
	}
        
        @GetMapping("/create")
        //перехід до сторинкі створення персони
	public String viewCreateForm() throws FileNotFoundException{
            System.out.println("Create persona page!");
            return render_template("create_person.html");
	}

        @GetMapping("/certs")
        //перехід до сторинкі створення персони
	public String listCerts() throws FileNotFoundException{
            System.out.println("Certs page!");
            
            return service.listCerts();
	}

        @GetMapping("/files")
        //перехід до сторинкі створення персони
	public String viewFiles() throws FileNotFoundException{
            System.out.println("ASIC's containers page!");
            return service.listAsic();
	}
        
        @PostMapping("/create")
	public Answer addPersona(@RequestBody Persona persona) {
            Answer ans;
            System.out.println("===============================ADD PERSONA==============================================");
            System.out.println(persona.toString());
            ans = (Answer) service.savePersona(persona);
            System.out.println(ans.toString());
            
            return ans;
        }
        
        @GetMapping("/find")
        //перехід до сторинкі відображення персони
	public String findPersonForm( @RequestParam(value="search_field",required=true)String searchKey, @RequestParam(value="search_value",required=true)String searchValue){
            System.out.println("Search persons...");
            System.out.println("key: " + searchKey);
            System.out.println("value: " + searchValue);
            
            String res = null;
            
            switch(searchKey){
                case "rnokpp" -> res = (String) service.findByRnokpp(searchValue);    
                case "firstName" -> res = (String) service.findByFirstName(searchValue);    
                case "lastName" -> res = (String) service.findByLastName(searchValue);    
                case "birthDate" -> res = (String) service.findByBirthDate(searchValue);    
                case "pasport" -> res = (String) service.findByPasport(searchValue);    
                case "unzr" -> res = (String) service.findByUnzr(searchValue);    
            }
        
            return res;
	}
        
        @GetMapping("/list")
        //перехід до сторинкі відображення списка персон
	public String listPersona() throws FileNotFoundException{
            System.out.println("List persona page!");
      
            return service.showAll();
	}
        
        @PatchMapping("/update")
	public Answer updatePersona(@RequestBody Persona persona) {
            Answer ans;
            System.out.println("===============================ADD PERSONA==============================================");
            System.out.println(persona.toString());
            ans = (Answer) service.savePersona(persona);
            System.out.println(ans.toString());
            
            return ans;
        }
        
        @DeleteMapping("/delete")
	public Answer deletePersona(@RequestBody String data) {
            JSONObject js = new JSONObject(data);
            Answer ans;
            System.out.println("===============================DELETE PERSONA==============================================");
            System.out.println(data);
            System.out.println(js.toString());
            ans = (Answer) service.deletePersona(js.getString("rnokpp"));
            System.out.println(ans.toString());
            
            return ans;
        }

        @PostMapping("/check")
	public Answer checkPersona(@RequestBody String data) {
            JSONObject js = new JSONObject(data);
            Answer ans;
            System.out.println("===============================CHECK PERSONA==============================================");
            System.out.println(data);
            System.out.println(js.toString());
            ans = (Answer) service.checkPersona(js.getString("rnokpp"));
            System.out.println(ans.toString());
            
            return ans;
        }
        
	@GetMapping("/notify")
	public ResponseEntity<Void> notification() throws Exception {
		return ResponseEntity.status(HttpStatus.CREATED)
				.header("HX-Trigger", mapper.writeValueAsString(Map.of("notice", "Notification"))).build();
	}
        
        
        //завантаження файлів
        @GetMapping("/download/{page}/{filename}")
	public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String page, @PathVariable String filename) throws IOException{
            String path = "";
            
            
            if("cert".equals(page)){
                if(AppSettings.CERTS_PATH.startsWith(".")){
                    path = new File(".").getCanonicalPath()+"/"+AppSettings.CERTS_PATH.substring(2)+"/"+filename;
                }else{
                    path = new File(".").getCanonicalPath()+"/"+AppSettings.CERTS_PATH+"/"+filename;
                }
            }else if("asic".equals(page)){
                if(AppSettings.ASIC_PATH.startsWith(".")){
                    path = new File(".").getCanonicalPath()+"/"+AppSettings.ASIC_PATH.substring(2)+"/"+filename;
                }else{
                    path = new File(".").getCanonicalPath()+"/"+AppSettings.ASIC_PATH+"/"+filename;
                }
            }

            System.out.println("Download file: "+path);
            File ff = new File(path);
            
            InputStream bin1 = new FileInputStream(path);
            long len = ff.length();

            return ResponseEntity
                .ok()
                .contentLength(len)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ff.getName() + "\"")
                .contentType(
                        MediaType.parseMediaType("application/octet-stream"))
                .body(new InputStreamResource(bin1));

        }

        
    public String render_template(String templateName)
        throws FileNotFoundException
    {
 
        // the stream holding the file content
        InputStream is = getClass().getClassLoader().getResourceAsStream("templates/"+templateName);
          
        String html = null;
        try (Scanner scanner = new Scanner(is, StandardCharsets.UTF_8.name())) {
            html = scanner.useDelimiter("\\A").next();
        }

        return html;
    }

}

