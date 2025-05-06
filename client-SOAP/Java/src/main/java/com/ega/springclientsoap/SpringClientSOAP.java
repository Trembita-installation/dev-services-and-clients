/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.ega.springclientsoap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.PropertySource;

/**
 *
 * @author sa
 */

@ServletComponentScan
@PropertySource("classpath:application.properties")
//Ця анотація говорить Спрингу, що це основний клас, який запускає наш Веб-додаток
@SpringBootApplication
public class SpringClientSOAP {

	public static void main(String[] args) {
		SpringApplication.run(SpringClientSOAP.class, args);
	}

}