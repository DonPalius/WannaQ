package com.wannaq.ApexAPI;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { ApexApiConfig.class })
class ApexApiConfigTest {


    @Autowired
    private final ApplicationContext applicationContext;

    ApexApiConfigTest(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }


    @Test
    void getWebclient() {
        assertThat(applicationContext.containsBean("getWebClient")).isTrue();
        assertThat(applicationContext.getBean("getWebClient"))
                .isInstanceOf(WebClient.class)
                .isNotNull();
    }


}