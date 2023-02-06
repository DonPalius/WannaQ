package com.wannaq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.Clock;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@SpringBootApplication
public class ApexApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApexApplication.class, args);
    }

    @Bean
    public Clock getClock(){
        return Clock.system(ZoneId.of("GMT"));
    }
}
