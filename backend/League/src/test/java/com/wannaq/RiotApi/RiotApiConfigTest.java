package com.wannaq.RiotApi;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { RiotApiConfig.class })
class RiotApiConfigTest {
    @Autowired
    private final ApplicationContext applicationContext;

    RiotApiConfigTest(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Test
    void riotApiClient() {
        assertThat(applicationContext.containsBean("riotApiClient")).isTrue();
        assertThat(applicationContext.getBean("riotApiClient"))
                .isInstanceOf(WebClient.class)
                .isNotNull();

    }
}