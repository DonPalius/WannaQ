package com.wannaq.ApexAPI;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wannaq.Exceptions.ApiKeyMissingException;
import com.wannaq.Exceptions.NickNameMissingException;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.codec.json.Jackson2CodecSupport;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;



class ApexApiServiceTest {
    private ApexApiService underTest;
    public static MockWebServer mockWebServer;

    @BeforeAll
    static void initialize() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @BeforeEach
    void setUp() {
        String baseUrl = mockWebServer.url("/").url().toString();
        WebClient webClient =  WebClient.builder()
                .baseUrl(baseUrl)
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
        underTest= new ApexApiService(webClient);
    }

    @Test
    void canGetDataApex() throws JsonProcessingException, InterruptedException {
        String apiKey = "someApiKey";
        Map<String,ApexApiResponse.Wins> stats = new HashMap<>();
        stats.put("wins_season_10", new ApexApiResponse.Wins(47L));
        stats.put("wins_season_9", new ApexApiResponse.Wins(101L));
        stats.put("wins_season_8", new ApexApiResponse.Wins(11L));
        stats.put("kills_season_10", new ApexApiResponse.Wins(241L));
        stats.put("kills_season_9", new ApexApiResponse.Wins(120L));
        stats.put("kills_season_8", new ApexApiResponse.Wins(1034L));

        ApexApiResponse expected= new ApexApiResponse(
                new ApexApiResponse.Global(
                       "someNickName",
                       new ApexApiResponse.Rank(
                               1830L,
                               "Master",
                               "1"
                       )
                ),
                stats
        );

        ObjectMapper objectMapper = new ObjectMapper();
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody(objectMapper.writeValueAsString(expected))
                .addHeader(HttpHeaders.CONTENT_TYPE,
                        MediaType.TEXT_PLAIN));


        ApexApiResponse actual = underTest.getDataApex("Lerabinou", apiKey);
        RecordedRequest request = mockWebServer.takeRequest(1, TimeUnit.SECONDS);

        System.out.println(expected);
        System.out.println(actual);

        assertThat(request.getMethod()).isEqualTo("GET");
        assertThat(expected).isEqualTo(actual);

    }

    @Test
    void cantGetDataApexUnauthorized() {
        mockWebServer.enqueue(
                new MockResponse()
                        .setResponseCode(401)
                        .addHeader(HttpHeaders.CONTENT_TYPE,
                                MediaType.TEXT_PLAIN)
        );
        assertThatThrownBy(()-> underTest
                .getDataApex("someGameNickName", "someApiKey"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("401 Unauthorized from GET");

    }

    @Test
    void cantGetDataApexNoApiKey() {
        assertThatThrownBy(()->underTest.getDataApex("someGameNickname",null))
                .isInstanceOf(ApiKeyMissingException.class)
                .hasMessageContaining("API KEY Missing");
        assertThatThrownBy(()->underTest.getDataApex("someGameNickname",""))
                .isInstanceOf(ApiKeyMissingException.class)
                .hasMessageContaining("API KEY Missing");
    }

    @Test
    void cantGetDataApexNoGameNickName() {
        assertThatThrownBy(()->underTest.getDataApex(null,"someApiKey"))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("Game NickName Missing");
        assertThatThrownBy(()->underTest.getDataApex("","someApiKey"))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("Game NickName Missing");
    }
}