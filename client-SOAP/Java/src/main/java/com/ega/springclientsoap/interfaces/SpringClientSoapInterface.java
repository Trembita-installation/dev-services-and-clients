/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ega.springclientsoap.interfaces;

import com.ega.springclientsoap.models.Answer;
import com.ega.springclientsoap.models.Persona;

/**
 *
 * @author sa
 */
public interface SpringClientSoapInterface {
   public String showAll();
   public String findByRnokpp(String rnokpp);
   public String findByFirstName(String firstName);
   public String findByLastName(String lastName);
   public String findByBirthDate(String birthDateStr);
   public String findByPasport(String pasport);
   public String findByUnzr(String unzr);
   public Answer checkup(String rnokpp);
   public Answer checkPersona(String rnokpp);
   public Answer savePersona(Persona persona);
   public Answer deletePersona(String rnokpp);
   public String listCerts();
   public String listAsic();
   public String downloadFile(String path);
    
}
