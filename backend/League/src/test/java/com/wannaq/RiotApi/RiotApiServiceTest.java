package com.wannaq.RiotApi;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;


class RiotApiServiceTest {
    private RiotApiService underTest;
    public static MockWebServer mockWebServer;


    @BeforeAll
    static void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @BeforeEach
    void initialize() {
        String baseURL = mockWebServer.url("/").url().toString();
        WebClient webClient = WebClient.create(baseURL);
        underTest = new RiotApiService(webClient);
    }

    @Test
    void canGetIdsLeague() throws IOException, InterruptedException {

        mockWebServer.url("summoner/v4/summoners/by-name/drunkfazor");

        RiotApiAccountInfo accountInfo = new RiotApiAccountInfo(
                "Uq1yzEXyA6jSzweVzzSzhT6foHC0jMiuBiQjrqmydUEMkeg",
                "toVmN989F0St7I0al1h6F9ZT6rC9DFZztjXF5pGwfE2bQic",
                "YbIsI0wKDSORUd0f14lzanE_70foPyyB_jpf0AeThtEGk1FbnV9g8u83Nwyf0LbPLI8Jm3_ZKLvw",
                "DrunkFazor",
                4658L,
                1652886724000L,
                246L
        );

        String apiKey = "SomeApiKey";

        ObjectMapper objectMapper = new ObjectMapper();

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody(objectMapper.writeValueAsString(accountInfo))
                .addHeader(HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE));

        RiotApiAccountInfo accountInfo1 = underTest.
                getIdsLeague("drunkfazor", apiKey);


        RecordedRequest request = mockWebServer.takeRequest(1, TimeUnit.SECONDS);
        assertThat(request.getMethod()).isEqualTo("GET");
        assertThat(accountInfo1).isEqualTo(accountInfo);

    }

    @Test
    void cantGetIdsLeagueNoApiKey() {

        assertThatThrownBy(()-> underTest
                .getIdsLeague("drunkfazor",null))
                .hasMessageContaining("API KEY Missing");

        assertThatThrownBy(()-> underTest
                .getIdsLeague("drunkfazor",""))
                .hasMessageContaining("API KEY Missing");
    }

    @Test
    void cantGetIdsLeagueNoSummonerName() {

        assertThatThrownBy(()-> underTest
                .getIdsLeague(null, "someApiKey"))
                .hasMessageContaining("SummonerName Missing");

        assertThatThrownBy(()-> underTest
                .getIdsLeague("", "someApiKey"))
                .hasMessageContaining("SummonerName Missing");
    }

    @Test
    void cantGetIdsLeagueErrorUnauthorized() {
        mockWebServer.url("summoner/v4/summoners/by-name/drunkfazor");
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(401)
                .addHeader(HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE));

        assertThatThrownBy(()-> underTest
                .getIdsLeague("DrunkFazor", "someApiKey"))
                .hasMessageContaining("401 Unauthorized from GET")
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void canGetRiotApiStats() throws IOException, InterruptedException {

        mockWebServer
                .url("league/v4/entries/by-summoner/afdsafsdaffedfbdffhhsdh");

        List<RiotApiSummonerStats> summonerStats = new ArrayList<>();
        summonerStats.add(new RiotApiSummonerStats(
                        "sadfsafdsaf",
                        "RANKED_SOLO_5x5",
                        "PLATINUM",
                        "IV",
                        "safdafsafdasfdasfsa",
                        "Drunk Fazor",
                        30L,
                        32L,
                        30L,
                        false,
                        false,
                        false,
                        false));
        summonerStats.add(new RiotApiSummonerStats(
                "sadfsafdsaf",
                "RANKED_FLEX_SR",
                "SILVER",
                "IV",
                "safdafsafdasfdasfsa",
                "Drunk Fazor",
                30L,
                32L,
                30L,
                false,
                false,
                false,
                false
        ));
        ObjectMapper objectMapper = new ObjectMapper();
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody(objectMapper.writeValueAsString(summonerStats))
                .addHeader(HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE));

        List<RiotApiSummonerStats> riotApiStats = underTest.getRiotApiStats("asfdafdsafdas",
                "apiKey"
        );


        RecordedRequest request = mockWebServer.takeRequest(1, TimeUnit.SECONDS);
        assertThat(request.getMethod()).isEqualTo("GET");
        assertThat(summonerStats).isEqualTo(riotApiStats);

    }

    @Test
    void cantGetRiotApiStatsNoAccountId() {
        assertThatThrownBy(()-> underTest
                .getRiotApiStats("","apikey"))
                .hasMessageContaining("Account ID Missing");

        assertThatThrownBy(()-> underTest
                .getRiotApiStats(null,"apikey"))
                .hasMessageContaining("Account ID Missing");
    }
    @Test
    void cantGetRiotApiStatsNoApiKey() {
        assertThatThrownBy(()-> underTest
                .getRiotApiStats("asdfasdfasf",null))
                .hasMessageContaining("API KEY Missing");

        assertThatThrownBy(()-> underTest
                .getRiotApiStats("fadfafdafasf",""))
                .hasMessageContaining("API KEY Missing");
    }

    @Test
    void cantGetRiotApiStatsErrorUnauthorized() {
        mockWebServer.url("summoner/v4/summoners/by-name/drunkfazor");
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(401)
                .addHeader(HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE));

        assertThatThrownBy(()-> underTest
                .getRiotApiStats("DrunkFazor", "someApiKey"))
                .hasMessageContaining("401 Unauthorized from GET")
                .isInstanceOf(RuntimeException.class);
    }


}