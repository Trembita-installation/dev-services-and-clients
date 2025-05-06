/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ega.springclientsoap;

import jakarta.xml.soap.MessageFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.core.WebServiceTemplate;
import org.springframework.ws.soap.saaj.SaajSoapMessageFactory;

/**
 *
 * @author sa
 */
@Configuration
public class WebConfig {
    public WebServiceTemplate web;
    
    public WebConfig(){
        this.web = InitWebService();
    }

    private WebServiceTemplate InitWebService(){
    try {
            SaajSoapMessageFactory messageFactory = new SaajSoapMessageFactory(MessageFactory.newInstance());
            
            messageFactory.afterPropertiesSet();
            WebServiceTemplate webServiceTemplate = new WebServiceTemplate(messageFactory);
            Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
            marshaller.setContextPath("io.spring.guides.gs_producing_web_service");
            marshaller.afterPropertiesSet();

            webServiceTemplate.setMarshaller(marshaller);
            webServiceTemplate.setUnmarshaller(marshaller);
            webServiceTemplate.afterPropertiesSet();
        
            return webServiceTemplate;
        }
        catch(Exception ex){
            return null;
        }
        
    }
}
