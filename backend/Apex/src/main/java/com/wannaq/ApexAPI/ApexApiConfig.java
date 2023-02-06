package com.wannaq.ApexAPI;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.codec.json.Jackson2CodecSupport;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class ApexApiConfig {
    @Bean
    public WebClient getWebClient(){
        String apexStatsUrl = "https://api.mozambiquehe.re";
        return WebClient.builder()
                .baseUrl(apexStatsUrl)
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer->{
                            ObjectMapper mapper = configurer
                                    .getReaders()
                                    .stream()
                                    .filter(reader -> reader instanceof Jackson2JsonDecoder)
                                    .map(reader-> (Jackson2JsonDecoder) reader)
                                    .map(Jackson2CodecSupport::getObjectMapper)
                                    .findFirst()
                                    .orElseGet(()-> Jackson2ObjectMapperBuilder.json().build());
                            Jackson2JsonDecoder decoder = new Jackson2JsonDecoder(mapper, MediaType.TEXT_PLAIN);
                            configurer.customCodecs().registerWithDefaultConfig(decoder);
                        })
                        .build()).build();
    }
}
