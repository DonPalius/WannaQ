package com.wannaq.RiotApi;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class RiotApiConfig {
    @Bean
    public WebClient riotApiClient(){
        return WebClient.create("https://euw1.api.riotgames.com/lol/");
    }
}
