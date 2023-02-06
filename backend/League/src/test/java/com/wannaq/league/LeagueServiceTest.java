package com.wannaq.league;

import com.wannaq.Exceptions.*;
import com.wannaq.RiotApi.RiotApiAccountInfo;
import com.wannaq.RiotApi.RiotApiService;
import com.wannaq.RiotApi.RiotApiSummonerStats;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.*;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.time.*;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;



class LeagueServiceTest {
    @Mock
    private LeagueRepository leagueRepository;
    @Mock
    private RiotApiService riotApiService;
    private AutoCloseable autoCloseable;
    @Mock
    private Clock clock;
    private LeagueService underTest;


    private final ZonedDateTime NOW = ZonedDateTime.of(
            2022,
            7,
            26,
            14,
            49,
            30,
            0,
            ZoneId.of("GMT")
    );



    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new LeagueService(
                leagueRepository,
                riotApiService,
                clock);
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }



    @Test
    void canGetSoloQ() {
        League currentUser = new League(
                "dsfafd",
                "drunkfazor",
                "adfasddaadsa",
                "agsdgadfadsa",
                "adfavsdvadsa",
                235L,
                "GOLD_I",
                34L,
                "SILVER_III",
                23L,
                25L,
                23L,
                20L,
                13L,
                null
        );

        List<League> allUsrs = new ArrayList<>();
        allUsrs.add(
                new League(
                        "dfsfdbbfbfb",
                        "enemystando",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        "PLATINUM_IV",
                        36L,
                        null,
                        null,
                        27L,
                        null,
                        20L,
                        null,
                        null
                )
        );
        allUsrs.add(
                new League(
                        "ddfsfdbbssfbfb",
                        "darthsmurf96",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        "PLATINUM_II",
                        36L,
                        "GOLD_IV",
                        63L,
                        27L,
                        27L,
                        20L,
                        14L,
                        null
                )
        );
        allUsrs.add(
                new League(
                        "ddfssssfdbbssfbfb",
                        "sirdonpalius",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        25L,
                        null,
                        null,
                        "BRONZE_II",
                        3L,
                        7L,
                        2L,
                        20L,
                        14L,
                        null
                )
        );

        when(leagueRepository.findById("dsfafd")).thenReturn(Optional.of(currentUser));
        when(leagueRepository.findAllByIdNot("dsfafd")).thenReturn(allUsrs);

        List<League> result = underTest.getSoloQ("dsfafd");
        verify(leagueRepository).findById("dsfafd");
        verify(leagueRepository).findAllByIdNot("dsfafd");

        assertThat(result).isEqualTo(allUsrs.subList(0,3));
    }
    @Test
    void canGetSoloQUserNotRanked() {
        League currentUser = new League(
                "dsfafd",
                "drunkfazor",
                "adfasddaadsa",
                "agsdgadfadsa",
                "adfavsdvadsa",
                235L,
                null,
                null,
                "SILVER_III",
                23L,
                25L,
                23L,
                20L,
                13L,
                null
        );

        List<League> allUsrs = new ArrayList<>();
        allUsrs.add(
                new League(
                        "dfsfdbbfbfb",
                        "enemystando",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        "PLATINUM_IV",
                        36L,
                        null,
                        null,
                        27L,
                        null,
                        20L,
                        null,
                        null
                )
        );
        allUsrs.add(
                new League(
                        "ddfsfdbbssfbfb",
                        "darthsmurf96",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        "PLATINUM_II",
                        36L,
                        "GOLD_IV",
                        63L,
                        27L,
                        27L,
                        20L,
                        14L,
                        null
                )
        );
        allUsrs.add(
                new League(
                        "ddfssssfdbbssfbfb",
                        "sirdonpalius",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        25L,
                        "IRON_I",
                        16L,
                        "BRONZE_II",
                        3L,
                        7L,
                        2L,
                        20L,
                        14L,
                        null
                )
        );

        when(leagueRepository.findById("dsfafd")).thenReturn(Optional.of(currentUser));
        when(leagueRepository.findAllByIdNot("dsfafd")).thenReturn(allUsrs);

        List<League> result = underTest.getSoloQ("dsfafd");
        verify(leagueRepository).findById("dsfafd");
        verify(leagueRepository).findAllByIdNot("dsfafd");

        assertThat(result).isEqualTo(allUsrs.subList(0,1));
    }

    @Test
    void cantGetSoloQIdNotFound(){
        given(leagueRepository.findById("dsfafd")).
                willReturn(Optional.empty());


        assertThatThrownBy(()->underTest.getSoloQ("dsfafd"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User Does Not Exists");
    }

    @Test
    void canGetSoloQNoUsersFound(){
        given(leagueRepository.findById("dsfafd")).
                willReturn(Optional.of(new League()));
        given(leagueRepository.findAllByIdNot("dsfafd")).
                willReturn(Collections.emptyList());
        List<League> allUsrs = underTest.getSoloQ("dsfafd");

        assertThat(allUsrs).isEqualTo(new ArrayList<>());
        verify(leagueRepository).findById("dsfafd");
    }

    @Test
    void cantGetSoloQUserIdMissing() {
        assertThatThrownBy(()->underTest.getSoloQ(""))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()->underTest.getSoloQ(null))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }

    @Test
    void canGetFlexQ() {

        League currentUser = new League(
                "dsfafd",
                "drunkfazor",
                "adfasddaadsa",
                "agsdgadfadsa",
                "adfavsdvadsa",
                235L,
                "PLATINUM_IV",
                34L,
                "SILVER_III",
                23L,
                25L,
                23L,
                20L,
                13L,
                null
        );
        List<League> allUsrs = new ArrayList<>();
        allUsrs.add(
                new League(
                        "dfsfdbbfbfb",
                        "enemystando",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        "PLATINUM_IV",
                        36L,
                        null,
                        null,
                        27L,
                        null,
                        20L,
                        null,
                        null
                )
        );
        allUsrs.add(
                new League(
                        "ddfsfdbbssfbfb",
                        "darthsmurf96",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        "DIAMOND_III",
                        36L,
                        "GOLD_IV",
                        63L,
                        27L,
                        27L,
                        20L,
                        14L,
                        null
                )
        );
        allUsrs.add(
                new League(
                        "ddfssssfdbbssfbfb",
                        "sirdonpalius",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        25L,
                        "IRON_I",
                        16L,
                        "DIAMOND_II",
                        3L,
                        7L,
                        2L,
                        20L,
                        14L,
                        null
                )
        );

        when(leagueRepository.findById("dsfafd")).thenReturn(Optional.of(currentUser));
        when(leagueRepository.findAllByIdNot("dsfafd")).thenReturn(allUsrs);

        List<League> result = underTest.getFlexQ("dsfafd");
        verify(leagueRepository).findById("dsfafd");
        verify(leagueRepository).findAllByIdNot("dsfafd");

        assertThat(result).isEqualTo(allUsrs.subList(0,2));
    }

    @Test
    void cantGetFlexQIdNotFound(){
        given(leagueRepository.findById("dsfafd")).
                willReturn(Optional.empty());


        assertThatThrownBy(()->underTest.getFlexQ("dsfafd"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User Does Not Exists");
    }

    @Test
    void cantGetFlexQUserIdMissing() {
        assertThatThrownBy(()->underTest.getFlexQ(""))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()->underTest.getFlexQ(null))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }

    @Test
    void canGetFlexQNoUsersFound(){
        given(leagueRepository.findById("dsfafd")).
                willReturn(Optional.of(new League()));
        given(leagueRepository.findAllByIdNot("dsfafd")).
                willReturn(Collections.emptyList());

        List<League> allUsrs = underTest.getFlexQ("dsfafd");

        verify(leagueRepository).findById("dsfafd");
        verify(leagueRepository).findAllByIdNot("dsfafd");
        assertThat(allUsrs).isEqualTo(new ArrayList<>());
    }

    @Test
    void canGetFlexQUserUnranked() {

        League currentUser = new League(
                "dsfafd",
                "drunkfazor",
                "adfasddaadsa",
                "agsdgadfadsa",
                "adfavsdvadsa",
                235L,
                "PLATINUM_IV",
                34L,
                null,
                null,
                25L,
                23L,
                20L,
                13L,
                null
        );
        List<League> allUsrs = new ArrayList<>();
        allUsrs.add(
                new League(
                        "dfsfdbbfbfb",
                        "enemystando",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        "PLATINUM_IV",
                        36L,
                        null,
                        null,
                        27L,
                        null,
                        20L,
                        null,
                        null
                )
        );
        allUsrs.add(
                new League(
                        "ddfsfdbbssfbfb",
                        "darthsmurf96",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        "DIAMOND_III",
                        36L,
                        "GOLD_IV",
                        63L,
                        27L,
                        27L,
                        20L,
                        14L,
                        null
                )
        );
        allUsrs.add(
                new League(
                        "ddfssssfdbbssfbfb",
                        "sirdonpalius",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        25L,
                        "IRON_I",
                        16L,
                        "DIAMOND_II",
                        3L,
                        7L,
                        2L,
                        20L,
                        14L,
                        null
                )
        );

        when(leagueRepository.findById("dsfafd")).thenReturn(Optional.of(currentUser));
        when(leagueRepository.findAllByIdNot("dsfafd")).thenReturn(allUsrs);

        List<League> result = underTest.getFlexQ("dsfafd");
        verify(leagueRepository).findById("dsfafd");
        verify(leagueRepository).findAllByIdNot("dsfafd");

        assertThat(result).isEqualTo(allUsrs.subList(0,2));
    }

    @Test
    void canUpdateStatsLeagueFlexQStats() {
        when(clock.instant()).thenReturn(
                NOW.toInstant());
        when(clock.getZone()).thenReturn(NOW.getZone());



        when(leagueRepository.findById("dsfafd"))
                .thenReturn(
                        Optional.of(new League(
                        "dsfafd",
                        "drunkfazor",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        null,
                        null,
                        "SILVER_III",
                        23L,
                        null,
                        23L,
                        null,
                        13L,
                        ZonedDateTime.from(NOW)
                                .minusMinutes(15)
                )));

        List<RiotApiSummonerStats> usersStats = new ArrayList<>();
        usersStats.add(new RiotApiSummonerStats(
                "sadfsafdsaf",
                "RANKED_FLEX_SR",
                "SILVER",
                "I",
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

        when(riotApiService
                .getRiotApiStats(any(),
                        any()))
                .thenReturn(usersStats);

        underTest.updateStatsLeague("dsfafd");

        League expected = new League(
                "dsfafd",
                "drunkfazor",
                "adfasddaadsa",
                "agsdgadfadsa",
                "adfavsdvadsa",
                235L,
                "PLATINUM_IV",
                34L,
                "SILVER_III",
                23L,
                25L,
                23L,
                20L,
                13L,
                ZonedDateTime.from(NOW)
        );
        expected.setRankflex(String.format("%s_%s",
                usersStats
                    .get(0)
                    .getTier(),
                usersStats
                        .get(0)
                        .getRank()));
        expected.setWinsflex(usersStats.get(0).getWins());
        expected.setLossflex(usersStats.get(0).getLosses());
        expected.setPointflex(usersStats.get(0).getLeaguePoints());
        expected.setRanksoloq(null);
        expected.setWinssoloq(null);
        expected.setLossesoloq(null);
        expected.setPointsoloq(null);
        expected.setTimestamp(NOW.plusMinutes(10));



        ArgumentCaptor<League> leagueArgumentCaptor =
                ArgumentCaptor.forClass(League.class);

        verify(leagueRepository).save(leagueArgumentCaptor.capture());

        assertThat(expected).isEqualTo(leagueArgumentCaptor.getValue());

    }

    @Test
    void canUpdateStatsLeagueSoloQStats() {
        when(clock.instant()).thenReturn(
                NOW.toInstant());
        when(clock.getZone()).thenReturn(NOW.getZone());



        when(leagueRepository.findById("dsfafd"))
                .thenReturn(
                        Optional.of(new League(
                                "dsfafd",
                                "drunkfazor",
                                "adfasddaadsa",
                                "agsdgadfadsa",
                                "adfavsdvadsa",
                                235L,
                                null,
                                null,
                                "SILVER_III",
                                23L,
                                null,
                                23L,
                                null,
                                13L,
                                ZonedDateTime.from(NOW)
                                        .minusMinutes(15)
                        )));

        List<RiotApiSummonerStats> usersStats = new ArrayList<>();
        usersStats.add(new RiotApiSummonerStats(
                "sadfsafdsaf",
                "RANKED_SOLO_5x5",
                "SILVER",
                "I",
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

        when(riotApiService
                .getRiotApiStats(any(),
                        any()))
                .thenReturn(usersStats);


        League expected = new League(
                "dsfafd",
                "drunkfazor",
                "adfasddaadsa",
                "agsdgadfadsa",
                "adfavsdvadsa",
                235L,
                "PLATINUM_IV",
                34L,
                "SILVER_III",
                23L,
                25L,
                23L,
                20L,
                13L,
                ZonedDateTime.from(NOW)
        );
        expected.setRanksoloq(String.format("%s_%s",
                usersStats
                        .get(0)
                        .getTier(),
                usersStats
                        .get(0)
                        .getRank()));
        expected.setWinssoloq(usersStats.get(0).getWins());
        expected.setLossesoloq(usersStats.get(0).getLosses());
        expected.setPointsoloq(usersStats.get(0).getLeaguePoints());

        expected.setRankflex(null);
        expected.setWinsflex(null);
        expected.setLossflex(null);
        expected.setPointflex(null);
        expected.setTimestamp(NOW.plusMinutes(10));

        underTest.updateStatsLeague("dsfafd");

        ArgumentCaptor<League> leagueArgumentCaptor =
                ArgumentCaptor.forClass(League.class);

        verify(leagueRepository).save(leagueArgumentCaptor.capture());


        assertThat(expected).isEqualTo(leagueArgumentCaptor.getValue());

    }

    @Test
    void cantUpdateStatsLeagueUserIdMissing() {
        assertThatThrownBy(()->underTest.updateStatsLeague(""))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()->underTest.updateStatsLeague(null))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }

    @Test
    void canSaveNewUserFlexQData() {
        when(clock.instant()).thenReturn(
                NOW.toInstant());
        when(clock.getZone()).thenReturn(NOW.getZone());

        when(leagueRepository.existsById(anyString())).thenReturn(false);
        when(leagueRepository.existsBySummonernameIgnoreCase(anyString()))
                .thenReturn(false);

        RiotApiAccountInfo accountInfo = new RiotApiAccountInfo(
                "Uq1yzEXyA6jSzweVzzSzhT6foHC0jMiuBiQjrqmydUEMkeg",
                "toVmN989F0St7I0al1h6F9ZT6rC9DFZztjXF5pGwfE2bQic",
                "YbIsI0wKDSORUd0f14lzanE_70foPyyB_jpf0AeThtEGk1FbnV9g8u83Nwyf0LbPLI8Jm3_ZKLvw",
                "DrunkFazor",
                4658L,
                1652886724000L,
                246L
        );

        when(riotApiService.getIdsLeague(any(),any()))
                .thenReturn(accountInfo);

        List<RiotApiSummonerStats> usersStats = new ArrayList<>();
        usersStats.add(new RiotApiSummonerStats(
                "sadfsafdsaf",
                "RANKED_SOLO_5x5",
                "SILVER",
                "I",
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

        when(riotApiService
                .getRiotApiStats(any(),
                        any()))
                .thenReturn(usersStats);


        League expected = new League();
        expected.setId("dsfafd");
        expected.setSummonername("DrunkFazor");
        expected.setAccountId(accountInfo.getAccountId());
        expected.setPuuid(accountInfo.getPuuid());
        expected.setSummonerLevel(accountInfo.getSummonerLevel());
        expected.setSummonerId(accountInfo.getId());
        expected.setRanksoloq(String.format("%s_%s",
                usersStats
                        .get(0)
                        .getTier(),
                usersStats
                        .get(0)
                        .getRank()));
        expected.setWinssoloq(usersStats.get(0).getWins());
        expected.setLossesoloq(usersStats.get(0).getLosses());
        expected.setPointsoloq(usersStats.get(0).getLeaguePoints());

        expected.setRankflex(null);
        expected.setWinsflex(null);
        expected.setLossflex(null);
        expected.setPointflex(null);
        expected.setTimestamp(NOW.plusMinutes(10));

        underTest.saveNewUser("DrunkFazor","dsfafd");

        ArgumentCaptor<League> leagueArgumentCaptor =
                ArgumentCaptor.forClass(League.class);

        verify(leagueRepository).save(leagueArgumentCaptor.capture());
        assertThat(expected).isEqualTo(leagueArgumentCaptor.getValue());

    }

    @Test
    void canSaveNewUserSoloQData() {
        when(clock.instant()).thenReturn(
                NOW.toInstant());
        when(clock.getZone()).thenReturn(NOW.getZone());

        when(leagueRepository.existsById(anyString())).thenReturn(false);
        when(leagueRepository.existsBySummonernameIgnoreCase(anyString()))
                .thenReturn(false);

        RiotApiAccountInfo accountInfo = new RiotApiAccountInfo(
                "Uq1yzEXyA6jSzweVzzSzhT6foHC0jMiuBiQjrqmydUEMkeg",
                "toVmN989F0St7I0al1h6F9ZT6rC9DFZztjXF5pGwfE2bQic",
                "YbIsI0wKDSORUd0f14lzanE_70foPyyB_jpf0AeThtEGk1FbnV9g8u83Nwyf0LbPLI8Jm3_ZKLvw",
                "DrunkFazor",
                4658L,
                1652886724000L,
                246L
        );

        when(riotApiService.getIdsLeague(any(),any()))
                .thenReturn(accountInfo);

        List<RiotApiSummonerStats> usersStats = new ArrayList<>();
        usersStats.add(new RiotApiSummonerStats(
                "sadfsafdsaf",
                "RANKED_FLEX_SR",
                "SILVER",
                "I",
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

        when(riotApiService
                .getRiotApiStats(any(),
                        any()))
                .thenReturn(usersStats);


        League expected = new League();
        expected.setId("dsfafd");
        expected.setSummonername("DrunkFazor");
        expected.setAccountId(accountInfo.getAccountId());
        expected.setPuuid(accountInfo.getPuuid());
        expected.setSummonerLevel(accountInfo.getSummonerLevel());
        expected.setSummonerId(accountInfo.getId());
        expected.setRankflex(String.format("%s_%s",
                usersStats
                        .get(0)
                        .getTier(),
                usersStats
                        .get(0)
                        .getRank()));
        expected.setWinsflex(usersStats.get(0).getWins());
        expected.setLossflex(usersStats.get(0).getLosses());
        expected.setPointflex(usersStats.get(0).getLeaguePoints());
        expected.setRanksoloq(null);
        expected.setWinssoloq(null);
        expected.setLossesoloq(null);
        expected.setPointsoloq(null);
        expected.setTimestamp(NOW.plusMinutes(10));

        underTest.saveNewUser("DrunkFazor","dsfafd");

        ArgumentCaptor<League> leagueArgumentCaptor =
                ArgumentCaptor.forClass(League.class);

        verify(leagueRepository).save(leagueArgumentCaptor.capture());
        assertThat(expected).isEqualTo(leagueArgumentCaptor.getValue());

    }

    @Test
    void cantSaveNewUserUserIdMissing() {
        assertThatThrownBy(()->underTest.saveNewUser("someSummonerName",""))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()->underTest.saveNewUser("someSummonerName",null))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }

    @Test
    void cantSaveNewUserSummonerNameMissing() {
        assertThatThrownBy(()->underTest.saveNewUser("","someID"))
                .isInstanceOf(SummonerNameMissingException.class)
                .hasMessageContaining("Summoner Name Missing");
        assertThatThrownBy(()->underTest.saveNewUser(null,"someID"))
                .isInstanceOf(SummonerNameMissingException.class)
                .hasMessageContaining("Summoner Name Missing");
    }

    @Test
    void cantSaveNewUserIdAlreadyExists(){
        given(leagueRepository.existsById(any())).willReturn(true);

        assertThatThrownBy(()->underTest.saveNewUser("someUsername", "someId"))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("User Already Exists in Database");

    }
    @Test
    void cantSaveNewUserSummonerNameAlreadyExists(){
        when(leagueRepository.existsById(any())).thenReturn(false);
        given(leagueRepository.existsBySummonernameIgnoreCase(any())).willReturn(true);

        assertThatThrownBy(()->underTest.saveNewUser("someUsername", "someId"))
                .isInstanceOf(SummonerNameAlreadyExistsException.class)
                .hasMessageContaining("Summoner Already Exists in Database");

    }

/*
    @Test
    void updateSummonerName() {
        when(clock.instant()).thenReturn(
                NOW.toInstant());
        when(clock.getZone()).thenReturn(NOW.getZone());


        when(leagueRepository.existsBySummonernameIgnoreCase("oldSummonerName"))
                .thenReturn(true);
        when(leagueRepository.existsById(anyString())).thenReturn(true);
        when(leagueRepository.existsBySummonernameIgnoreCase("newSummonerName"))
                .thenReturn(false);

        when(leagueRepository.findById(anyString())).thenReturn(
                Optional.of(new League(
                        "dsfafd",
                        "oldSummonerName",
                        "adfasddaadsa",
                        "agsdgadfadsa",
                        "adfavsdvadsa",
                        235L,
                        null,
                        null,
                        "SILVER_III",
                        23L,
                        null,
                        23L,
                        null,
                        13L,
                        ZonedDateTime.from(NOW)
                                .minusMinutes(15)
                )));

        RiotApiAccountInfo accountInfo = new RiotApiAccountInfo(
                "Uq1yzEXyA6jSzweVzzSzhT6foHC0jMiuBiQjrqmydUEMkeg",
                "toVmN989F0St7I0al1h6F9ZT6rC9DFZztjXF5pGwfE2bQic",
                "YbIsI0wKDSORUd0f14lzanE_70foPyyB_jpf0AeThtEGk1FbnV9g8u83Nwyf0LbPLI8Jm3_ZKLvw",
                "DrunkFazor",
                4658L,
                1652886724000L,
                246L
        );

        when(riotApiService.getIdsLeague(any(),any()))
                .thenReturn(accountInfo);

        List<RiotApiSummonerStats> usersStats = new ArrayList<>();
        usersStats.add(new RiotApiSummonerStats(
                "sadfsafdsaf",
                "RANKED_SOLO_5x5",
                "SILVER",
                "I",
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
        usersStats.add(new RiotApiSummonerStats(
                "sadfsafdsaf",
                "RANKED_FLEX_SR",
                "SILVER",
                "III",
                "safdafsafdasfdasfsa",
                "Drunk Fazor",
                45L,
                120L,
                33L,
                false,
                false,
                false,
                false
        ));

        when(riotApiService
                .getRiotApiStats(any(),
                        any()))
                .thenReturn(usersStats);


        League expected = new League();
        expected.setId("dsfafd");
        expected.setSummonername("DrunkFazor");
        expected.setAccountId(accountInfo.getAccountId());
        expected.setPuuid(accountInfo.getPuuid());
        expected.setSummonerLevel(accountInfo.getSummonerLevel());
        expected.setSummonerId(accountInfo.getId());

        expected.setRanksoloq(String.format("%s_%s",
                usersStats
                        .get(0)
                        .getTier(),
                usersStats
                        .get(0)
                        .getRank()));
        expected.setWinssoloq(usersStats.get(0).getWins());
        expected.setLossesoloq(usersStats.get(0).getLosses());
        expected.setPointsoloq(usersStats.get(0).getLeaguePoints());

        expected.setRankflex(String.format("%s_%s",
                usersStats
                        .get(1)
                        .getTier(),
                usersStats
                        .get(1)
                        .getRank()));

        expected.setWinsflex(usersStats.get(1).getWins());
        expected.setLossflex(usersStats.get(1).getLosses());
        expected.setPointflex(usersStats.get(1).getLeaguePoints());

        expected.setTimestamp(NOW.plusMinutes(10));

        underTest.updateSummonerName("someId",
                "oldSummonerName",
                "newSummonerName");

        ArgumentCaptor<League> leagueArgumentCaptor =
                ArgumentCaptor.forClass(League.class);

        verify(leagueRepository).save(leagueArgumentCaptor.capture());
        assertThat(expected).isEqualTo(leagueArgumentCaptor.getValue());

    }

    @Test
    void cantUpdateSummonerNameUserIdMissing() {
        assertThatThrownBy(()->underTest.updateSummonerName("","oldSummonerName", "newSummonerName"))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()->underTest.updateSummonerName("","oldSummonerName", "newSummonerName"))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }

    @Test
    void cantUpdateSummonerNameOldSummonerNameMissing() {
        assertThatThrownBy(()->underTest.updateSummonerName("someId","", "newSummonerName"))
                .isInstanceOf(SummonerNameMissingException.class)
                .hasMessageContaining("Old Summoner Name Missing");
        assertThatThrownBy(()->underTest.updateSummonerName("someId",null, "newSummonerName"))
                .isInstanceOf(SummonerNameMissingException.class)
                .hasMessageContaining("Old Summoner Name Missing");
    }

    @Test
    void cantUpdateSummonerNameNewSummonerNameMissing() {
        assertThatThrownBy(()->underTest
                .updateSummonerName("someId","oldSummonerName", ""))
                .isInstanceOf(SummonerNameMissingException.class)
                .hasMessageContaining("New Summoner Name Missing");
        assertThatThrownBy(()->underTest
                .updateSummonerName("someId","oldSummonerName", null))
                .isInstanceOf(SummonerNameMissingException.class)
                .hasMessageContaining("New Summoner Name Missing");
    }

    @Test
    void cantUpdateSummonerNameOldNameDoesNotExist(){
        given(leagueRepository.existsBySummonernameIgnoreCase("oldSummonerName"))
                .willReturn(false);

        assertThatThrownBy(()->underTest.updateSummonerName("someId",
                "oldSummonerName",
                "newSummonerName"))
                .isInstanceOf(SummonerNameNotFoundException.class)
                .hasMessageContaining("Summoner Name Not Found");
    }
    @Test
    void cantUpdateSummonerNameUserDoesNotExist(){
        given(leagueRepository.existsBySummonernameIgnoreCase("oldSummonerName"))
                .willReturn(true);
        given(leagueRepository.findById("oldSummonerName"))
                .willReturn(Optional.empty());

        assertThatThrownBy(()->underTest.updateSummonerName("someId",
                "oldSummonerName",
                "newSummonerName"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User Not Present In Database");
    }

    @Test
    void cantUpdateSummonerNameOldSummonerNameNotMatching(){
        given(leagueRepository.existsBySummonernameIgnoreCase("oldSummonerName"))
                .willReturn(true);
        League league = new League();
        league.setSummonername("someOtherSummonerName");
        league.setId("someId");

        given(leagueRepository.findById(anyString()))
                .willReturn(Optional.of(league));

        assertThatThrownBy(()->underTest.updateSummonerName("someId",
                "oldSummonerName",
                "newSummonerName"))
                .isInstanceOf(SummonerNameNotMatchingException.class)
                .hasMessageContaining("Illegal Access from User");
    }

    @Test
    void cantUpdateSummonerNameNewSummonerNameAlreadyExists(){
        given(leagueRepository.existsBySummonernameIgnoreCase("oldSummonerName"))
                .willReturn(true);
        League league = new League();
        league.setSummonername("oldSummonerName");
        league.setId("someId");

        given(leagueRepository.findById(anyString()))
                .willReturn(Optional.of(league));
        given(leagueRepository.existsBySummonernameIgnoreCase(anyString()))
                .willReturn(true);

        assertThatThrownBy(()->underTest.updateSummonerName("someId",
                "oldSummonerName",
                "newSummonerName"))
                .isInstanceOf(SummonerNameAlreadyExistsException.class)
                .hasMessageContaining("New Summoner Name Already Exist In Database");
    }
*/

    @Test
    void canGetStats(){
        League league = new League();
        league.setSummonername("someSummonerName");
        league.setId("someId");

        given(leagueRepository.findBySummonernameIgnoreCase(anyString()))
                .willReturn(Optional.of(league));

        League expected = underTest.getStats("someSummonerName");

        verify(leagueRepository).findBySummonernameIgnoreCase(anyString());

        assertThat(league).isEqualTo(expected);
    }



    @Test
    void cantGetStatsUserSummonerNameMissing() {
        assertThatThrownBy(()->underTest.getStats(""))
                .isInstanceOf(SummonerNameMissingException.class)
                .hasMessageContaining("Summoner Name Missing");
        assertThatThrownBy(()->underTest.getStats(null))
                .isInstanceOf(SummonerNameMissingException.class)
                .hasMessageContaining("Summoner Name Missing");
    }

    @Test
    void cantGetStatsUserNotFound(){
        given(leagueRepository.findById(anyString()))
                .willReturn(Optional.empty());
        assertThatThrownBy(()->underTest.getStats("someSummonerName"))
                .isInstanceOf(SummonerNameNotFoundException.class)
                .hasMessageContaining("Summoner Not Found");
    }

    @Test
    void cantGetStatsSummonerNameNotMatching(){
        League league = new League();
        league.setSummonername("someSummonerName");
        league.setId("someId");

        given(leagueRepository.findById(anyString()))
                .willReturn(Optional.of(league));


    }
}
