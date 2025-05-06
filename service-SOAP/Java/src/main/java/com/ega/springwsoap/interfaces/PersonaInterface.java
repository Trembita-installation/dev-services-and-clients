/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ega.springwsoap.interfaces;

import com.ega.springwsoap.models.Answer;
import io.spring.guides.gs_producing_web_service.AddPersonaRequest;
import io.spring.guides.gs_producing_web_service.AddPersonaResponse;
import io.spring.guides.gs_producing_web_service.CheckPersonaResponse;
import io.spring.guides.gs_producing_web_service.DeletePersonaResponse;
import io.spring.guides.gs_producing_web_service.GetPersonaListResponse;
import io.spring.guides.gs_producing_web_service.UpdatePersonaRequest;
import io.spring.guides.gs_producing_web_service.UpdatePersonaResponse;

/**
 * Це інтерфейс - клас який задає, які процедури та функціі буде єкспорувати наша програма.
 */
public interface PersonaInterface {
   public GetPersonaListResponse showAllPersons();
   public AddPersonaResponse addPersona(AddPersonaRequest request);
   public GetPersonaListResponse find(String rnokpp);
   public Answer checkup(String rnokpp);
   public CheckPersonaResponse checkPersona(String rnokpp);
   public UpdatePersonaResponse updatePersona(UpdatePersonaRequest request);
   public DeletePersonaResponse deletePersona(String rnokpp);
   public GetPersonaListResponse findByFirstName(String firstName);
   public GetPersonaListResponse findByLastName(String lastName);
   public GetPersonaListResponse findByBirthDate(String birthDate);
   public GetPersonaListResponse findByPasport(String pasport);
   public GetPersonaListResponse findByUnzr(String unzr);
   
  
}
