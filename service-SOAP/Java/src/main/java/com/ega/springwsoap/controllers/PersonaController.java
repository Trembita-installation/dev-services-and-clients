/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ega.springwsoap.controllers;


import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;


import com.ega.springwsoap.services.PersonaServiceImpl;
import io.spring.guides.gs_producing_web_service.AddPersonaRequest;
import io.spring.guides.gs_producing_web_service.AddPersonaResponse;
import io.spring.guides.gs_producing_web_service.CheckPersonaRequest;
import io.spring.guides.gs_producing_web_service.CheckPersonaResponse;
import io.spring.guides.gs_producing_web_service.DeletePersonaRequest;
import io.spring.guides.gs_producing_web_service.DeletePersonaResponse;
import io.spring.guides.gs_producing_web_service.GetPersonaListByBirthDateRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListByFirstNameRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListByLastNameRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListByPasportRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListByUnzrRequest;
import io.spring.guides.gs_producing_web_service.GetPersonaListResponse;
import io.spring.guides.gs_producing_web_service.GetPersonaRequest;
import io.spring.guides.gs_producing_web_service.UpdatePersonaRequest;
import io.spring.guides.gs_producing_web_service.UpdatePersonaResponse;
import jakarta.transaction.Transactional;
import jakarta.xml.soap.Node;
import jakarta.xml.soap.SOAPElement;
import jakarta.xml.soap.SOAPException;
import jakarta.xml.soap.SOAPHeader;
import jakarta.xml.soap.SOAPHeaderElement;
import java.util.Iterator;
import javax.xml.namespace.QName;
import lombok.AllArgsConstructor;
import org.springframework.ws.context.MessageContext;
import org.springframework.ws.soap.saaj.SaajSoapMessage;

//Ця анотація відноситься до компоненту Lombok. Вона допомогає створити усі конструктори класів та перемених яки відносятся до данного класу.
//Тут він потрібен для того, щоб ініціалізувати PersonaService service і таким чином включити його в область видимості фреймворка SPRING
//(дивись в документаціі к фреймворку "впровадження залежностей через конструктор")
@AllArgsConstructor
@Endpoint
public class PersonaController {
	private static final String NAMESPACE_URI = "http://spring.io/guides/gs-producing-web-service";

        private PersonaServiceImpl service;

        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPersonaRequest")
	@ResponsePayload
	public GetPersonaListResponse getPersona(@RequestPayload GetPersonaRequest request, MessageContext messageContext) {
            System.out.println("WebService: Get persona by RNOKPP "+request.getRnokpp());
            System.out.println(""+request.toString());
            GetPersonaListResponse response = (GetPersonaListResponse) service.find(request.getRnokpp());

            handleHeaders(messageContext);

            return response;
	}

        private void handleHeaders(MessageContext messageContext){
            
            //Create Response Body and Header
            SaajSoapMessage soapResponse = (SaajSoapMessage) messageContext.getResponse();
            SOAPHeader soapResponseHeader;

            SaajSoapMessage soapRequest = (SaajSoapMessage) messageContext.getRequest();
            SOAPHeader soapRequestHeader;
            
            try {
                soapResponseHeader = soapResponse.getSaajMessage().getSOAPHeader();
                soapRequestHeader = soapRequest.getSaajMessage().getSOAPHeader();
                SOAPHeaderElement headerResponse;
                
                Iterator<SOAPHeaderElement> headers = soapRequestHeader.examineAllHeaderElements();
                while(headers.hasNext()){
                    SOAPHeaderElement headerRequest = headers.next();
                    
                    QName qname= new QName(headerRequest.getElementQName().getNamespaceURI(),headerRequest.getElementQName().getLocalPart(),headerRequest.getElementQName().getPrefix());
                    headerResponse = soapResponseHeader.addHeaderElement(qname);
                    if(headerRequest.getValue()!=null){
                        headerResponse.setValue(""+headerRequest.getValue());
                    }
                    
                    if(headerRequest.hasChildNodes()){
                        Iterator<Node> childElements = headerRequest.getChildElements();
                        while(childElements.hasNext()){
                            Node childHeader = childElements.next();
                            if(childHeader.getLocalName()!=null){
                                SOAPElement childHeaderResponse = headerResponse.addChildElement(childHeader.getLocalName());
                                childHeaderResponse.setValue(""+childHeader.getValue());
                            }
                        }
                    }
                }
            } catch (SOAPException ex) {
                System.out.println("SOAPException: "+ex.getMessage());
            }
 
        }
        
        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPersonaListRequest")
	@ResponsePayload
	public GetPersonaListResponse getPersonaList(MessageContext messageContext) {
            System.out.println("WebService: List persons");
            GetPersonaListResponse response = (GetPersonaListResponse) service.showAllPersons();

            handleHeaders(messageContext);
            
            return response;
	}
        
        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPersonaListByFirstNameRequest")
	@ResponsePayload
	public GetPersonaListResponse getPersonaListByFirstName(@RequestPayload GetPersonaListByFirstNameRequest request, MessageContext messageContext) {
            System.out.println("WebService: getPersonaListByFirstName: "+request.getFirstName());
            
            GetPersonaListResponse response = (GetPersonaListResponse) service.findByFirstName(request.getFirstName());

            handleHeaders(messageContext);

            return response;
	}

        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPersonaListByLastNameRequest")
	@ResponsePayload
	public GetPersonaListResponse getPersonaListByLastName(@RequestPayload GetPersonaListByLastNameRequest request, MessageContext messageContext) {
            System.out.println("WebService: getPersonaListByLastNameRequest: "+request.getLastName());
            GetPersonaListResponse response = (GetPersonaListResponse) service.findByLastName(request.getLastName());

            handleHeaders(messageContext);

            return response;
	}

        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPersonaListByBirthDateRequest")
	@ResponsePayload
	public GetPersonaListResponse getPersonaListByBirthDate(@RequestPayload GetPersonaListByBirthDateRequest request, MessageContext messageContext) {
            System.out.println("WebService: GetPersonaListByBirthDateRequest: "+request.getBirthDate());
            GetPersonaListResponse response =  (GetPersonaListResponse) service.findByBirthDate(request.getBirthDate());

            handleHeaders(messageContext);

            return response;
        }

        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPersonaListByPasportRequest")
	@ResponsePayload
	public GetPersonaListResponse getPersonaListByPasport(@RequestPayload GetPersonaListByPasportRequest request, MessageContext messageContext) {
            System.out.println("WebService: GetPersonaListByPasportRequest: "+request.getPasport());
            GetPersonaListResponse response =  (GetPersonaListResponse) service.findByPasport(request.getPasport());

            handleHeaders(messageContext);

            return response;
        
        }

        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPersonaListByUnzrRequest")
	@ResponsePayload
	public GetPersonaListResponse getPersonaListByUnzr(@RequestPayload GetPersonaListByUnzrRequest request, MessageContext messageContext) {
            System.out.println("WebService: GetPersonaListByUnzrRequest: "+request.getUnzr());
            GetPersonaListResponse response =  (GetPersonaListResponse) service.findByUnzr(request.getUnzr());

            handleHeaders(messageContext);

            return response;

        }
        
        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addPersonaRequest")
	@ResponsePayload
	public AddPersonaResponse addPersona(@RequestPayload AddPersonaRequest request, MessageContext messageContext) {
            System.out.println("WebService: Add persona");
            AddPersonaResponse response =  (AddPersonaResponse)service.addPersona(request);

            handleHeaders(messageContext);

            return response;
        }

        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "checkPersonaRequest")
	@ResponsePayload
	public CheckPersonaResponse checkPersona(@RequestPayload CheckPersonaRequest request, MessageContext messageContext) {
            System.out.println("WebService: Check persona");
            CheckPersonaResponse response =  (CheckPersonaResponse)service.checkPersona(request.getRnokpp());

            handleHeaders(messageContext);

            return response;
        }
        
        
        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deletePersonaRequest")
	@ResponsePayload
        @Transactional
	public DeletePersonaResponse deletePersona(@RequestPayload DeletePersonaRequest request, MessageContext messageContext) {
            System.out.println("WebService: Delete persona");
            DeletePersonaResponse response = (DeletePersonaResponse) service.deletePersona(request.getRnokpp());

            handleHeaders(messageContext);

            return response;

        }

        @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updatePersonaRequest")
	@ResponsePayload
	public UpdatePersonaResponse updatePersona(@RequestPayload UpdatePersonaRequest request, MessageContext messageContext) {
            System.out.println("WebService: Update persona");
            UpdatePersonaResponse response = (UpdatePersonaResponse) service.updatePersona(request);

            handleHeaders(messageContext);

            return response;
        }

}