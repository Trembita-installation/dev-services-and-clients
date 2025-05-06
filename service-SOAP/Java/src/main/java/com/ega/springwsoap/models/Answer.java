/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ega.springwsoap.models;

import io.spring.guides.gs_producing_web_service.AnswerXml;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlType;
import lombok.Builder;
import lombok.Data;
import org.springframework.beans.BeanUtils;

/**
 * Цей клас містить модель відповіді на будь-який запит
 * status - вказує чи є запит успішним.
 * descr - текстовий опис результату відповіді. Якщо status = false, тут повинне бути опис причини
 * result - результат запита. Зазвичай результат надається в форматі JSON 
 */
@Data

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "answer", propOrder = {
    "status",
    "descr",
    "result"
})

// Аннотация @Builder создает сложные API-интерфейсы компоновщика для ваших классов.
// Builder позволяет автоматически создавать код, необходимый для создания экземпляра вашего класса с помощью кода.
@Builder
public class Answer {
    private Boolean status;
    @XmlElement(required = true)
    private String descr;
    @XmlElement(required = true)
    private String result;

    public AnswerXml toXml(){
        AnswerXml ansXml = new AnswerXml();
        BeanUtils.copyProperties(this, ansXml);

        return ansXml;
    }
}
