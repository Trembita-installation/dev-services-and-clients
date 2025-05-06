/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ega.springclientdemo.services;

import com.ega.springclientdemo.interfaces.LogRecordInterface;
import com.ega.springclientdemo.models.AppSettings;
import com.ega.springclientdemo.models.LogRecord;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

/**
 *
 * @author sa
 */
@Component
@PropertySource("classpath:application.properties")
public class LogRecordService implements LogRecordInterface{
    //ініціалізація файлу налаштувань
    
    
    @Override
    public Boolean addRecord(LogRecord record) {
    //    System.out.println("logFileName = "+logFileName+"\nLogLevel = "+logLevel);
        
        switch(AppSettings.LOG_LEVEL){
            case "0" -> AddRecordLevel0(record); //немає логування
            case "1" -> AddRecordLevel1(record); //тільки помилки
            case "2" -> AddRecordLevel2(record); //всі повідомлення, але без тіла запиту та без тіла відповіді.
            case "3" -> AddRecordLevel3(record); //повний лог.
        }
        
        return true;
    }

    //Level 0 - Log не потрібен.
    private void AddRecordLevel0(LogRecord record) {
        return;
    }

    //Level 1 - логує тільки помилки.
    private void AddRecordLevel1(LogRecord record) {
        if(record.isError()!=true){
            return;
        }
        WriteDataToLogFile(record.toJSON().toString());
    }

    //Level 2 - логує помилки, запити, але не включає до себе тіло запиту та повну відподідь.
    private void AddRecordLevel2(LogRecord record) {
        record.setBody("");
        record.setResult(null);
        WriteDataToLogFile(record.toJSON().toString());
    }

    //Level 3 - детально логує всі запити та відповіді включно з їх вмістом.
    private void AddRecordLevel3(LogRecord record) {
        WriteDataToLogFile(record.toJSON().toString());
    }

    //Безпосередньо записує лог в файл
    private void WriteDataToLogFile(String toString) {
        BufferedWriter writer;
        try {
            File f = new File(AppSettings.LOG_FILENAME);
            if(f.exists() && !f.isDirectory()) { 
                writer = new BufferedWriter(new FileWriter(AppSettings.LOG_FILENAME, true));
                writer.append(toString+"\n");
                writer.close();
            }else{
                writer = new BufferedWriter(new FileWriter(AppSettings.LOG_FILENAME, true));
                writer.write(toString);
                writer.close();
            }

        } catch (IOException ex) {
            System.out.println("Неможливо зробити запис в лог-файл: "+ex.getMessage());
        }

    
    }
    
}
