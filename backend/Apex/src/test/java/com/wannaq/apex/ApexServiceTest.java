package com.wannaq.apex;

import com.wannaq.ApexAPI.ApexApiResponse;
import com.wannaq.ApexAPI.ApexApiService;
import com.wannaq.Exceptions.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Clock;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ApexServiceTest {

    @Mock
    private ApexRepository apexRepository;
    @Mock
    private Clock clock;
    @Mock
    private ApexApiService apexApiService;

    private AutoCloseable autoCloseable;
    private ApexService underTest;

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
        underTest = new ApexService(
                apexRepository,
                apexApiService,
                clock
        );
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    void canGetMatch() {
        Apex currentUser = new Apex(
                "someId",
                "someGameNickname",
                2950L,
                "Bronze",
                47L,
                241L,
                null
        );
        List<Apex> allusrs = new ArrayList<>();
        allusrs.add(new Apex(
                "someotherId",
                "bestapexplayereva",
                500L,
                "Rookie",
                4L,
                41L,
                null
        ));
        allusrs.add(new Apex(
                "id",
                "actualPro",
                19500L,
                "Apex Predator",
                4700L,
                2041L,
                null
        ));
        allusrs.add(new Apex(
                "anyId",
                "normalPlayer",
                3020L,
                "Silver",
                46L,
                341L,
                null
        ));
        allusrs.add(new Apex(
                "anyotherId",
                "Noob",
                1400L,
                "Bronze",
                26L,
                1971L,
                null
        ));
        allusrs.add(new Apex(
                "ida",
                "actualsPro",
                null,
                null,
                4700L,
                20411L,
                null
        ));

        when(apexRepository.findById("someId"))
                .thenReturn(Optional.of(currentUser));
        when(apexRepository.findAllByIdNot("someId"))
                .thenReturn(allusrs);

        List<Apex> actual = underTest.getMatch("someId");
        verify(apexRepository).findById("someId");
        verify(apexRepository).findAllByIdNot("someId");

        List<Apex> expected = allusrs.subList(2,4);
//        expected.add(allusrs.get(0));

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void canGetMatchUserUnranked() {
        Apex currentUser = new Apex(
                "someId",
                "someGameNickname",
                null,
                null,
                47L,
                241L,
                null
        );
        List<Apex> allusrs = new ArrayList<>();
        allusrs.add(new Apex(
                "someotherId",
                "bestapexplayereva",
                500L,
                "Rookie",
                4L,
                41L,
                null
        ));
        allusrs.add(new Apex(
                "id",
                "actualPro",
                19500L,
                "Apex Predator",
                4700L,
                2041L,
                null
        ));
        allusrs.add(new Apex(
                "anyId",
                "normalPlayer",
                3020L,
                "Silver",
                46L,
                341L,
                null
        ));
        allusrs.add(new Apex(
                "anyotherId",
                "Noob",
                1400L,
                "Bronze",
                26L,
                1971L,
                null
        ));
        allusrs.add(new Apex(
                "ida",
                "actualsPro",
                null,
                null,
                4700L,
                20411L,
                null
        ));

        when(apexRepository.findById("someId"))
                .thenReturn(Optional.of(currentUser));
        when(apexRepository.findAllByIdNot("someId"))
                .thenReturn(allusrs);

        List<Apex> actual = underTest.getMatch("someId");

        verify(apexRepository).findById("someId");
        verify(apexRepository).findAllByIdNot("someId");

        List<Apex> expected = allusrs.subList(4,5);

        assertThat(expected).isEqualTo(actual);
    }

    @Test
    void cantGetMatchUserIdMissing() {
        assertThatThrownBy(()-> underTest.getMatch(""))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()-> underTest.getMatch(null))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }

    @Test
    void cantGetMatchUserNotFound() {
        given(apexRepository.findById("dsfafd")).
                willReturn(Optional.empty());


        assertThatThrownBy(()->underTest.getMatch("dsfafd"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User Does Not Exists");
    }

    @Test
    void cantGetMatchNoUsersFound() {
        given(apexRepository.findById("dsfafd")).
                willReturn(Optional.of(new Apex()));
        given(apexRepository.findAllByIdNot("dsfafd")).
                willReturn(Collections.emptyList());
        List<Apex> allUsrs = underTest.getMatch("dsfafd");

        assertThat(allUsrs).isEmpty();

        verify(apexRepository).findById(any());
        verify(apexRepository).findAllByIdNot(any());
    }

    @Test
    void canUpdateStatsApex() {
        Apex currentUser = new Apex(
                "someId",
                "someGameNickname",
                2950L,
                "Bronze",
                47L,
                241L,
                ZonedDateTime.from(NOW)
                        .minusMinutes(15)
        );
        Map<String,ApexApiResponse.Wins> stats = new HashMap<>();
        stats.put("wins_season_10", new ApexApiResponse.Wins(47L));
        stats.put("wins_season_9", new ApexApiResponse.Wins(101L));
        stats.put("wins_season_8", new ApexApiResponse.Wins(11L));
        stats.put("kills_season_10", new ApexApiResponse.Wins(241L));
        stats.put("kills_season_9", new ApexApiResponse.Wins(120L));
        stats.put("kills_season_8", new ApexApiResponse.Wins(1034L));


        ApexApiResponse apiResponse = new ApexApiResponse(
                new ApexApiResponse.Global(
                        "someGameNickname",
                        new ApexApiResponse.Rank(
                                18300L,
                                "Master",
                                "1"
                        )
                ),
                stats
        );

        when(clock.instant())
                .thenReturn(NOW.toInstant());
        when(clock.getZone())
                .thenReturn(NOW.getZone());
        when(apexRepository.findById(any()))
                .thenReturn(Optional.of(currentUser));
        when(apexApiService.getDataApex(any(),any()))
                .thenReturn(apiResponse);

        underTest.updateStatsApex("someId");

        ArgumentCaptor<Apex> apexArgumentCaptor =
                ArgumentCaptor.forClass(Apex.class);

        verify(apexRepository).save(apexArgumentCaptor.capture());
        verify(apexRepository).findById("someId");
        Apex actual = apexArgumentCaptor.getValue();
        Apex expected = new Apex(
                "someId",
                apiResponse.getGlobal().getApexNickName(),
                apiResponse.getGlobal().getRank().getRankScore(),
                apiResponse.getGlobal().getRank().getRankName(),
                (long) apiResponse.getTotal().get("wins_season_10").getValue(),
                (long) apiResponse.getTotal().get("kills_season_10").getValue(),
                ZonedDateTime.from(NOW)
                        .plusMinutes(10)
        );
        assertThat(expected).isEqualTo(actual);
    }

    @Test
    void canUpdateStatsApexNoSeason10() {
        Apex currentUser = new Apex(
                "someId",
                "someGameNickname",
                2950L,
                "Bronze",
                47L,
                241L,
                ZonedDateTime.from(NOW)
                        .minusMinutes(15)
        );
        Map<String,ApexApiResponse.Wins> stats = new HashMap<>();

        stats.put("wins_season_9", new ApexApiResponse.Wins(101L));
        stats.put("wins_season_8", new ApexApiResponse.Wins(11L));

        stats.put("kills_season_9", new ApexApiResponse.Wins(120L));
        stats.put("kills_season_8", new ApexApiResponse.Wins(1034L));


        ApexApiResponse apiResponse = new ApexApiResponse(
                new ApexApiResponse.Global(
                        "someGameNickname",
                        new ApexApiResponse.Rank(
                                18300L,
                                "Master",
                                "1"
                        )
                ),
                stats
        );

        when(clock.instant())
                .thenReturn(NOW.toInstant());
        when(clock.getZone())
                .thenReturn(NOW.getZone());
        when(apexRepository.findById(any()))
                .thenReturn(Optional.of(currentUser));
        when(apexApiService.getDataApex(any(),any()))
                .thenReturn(apiResponse);

        underTest.updateStatsApex("someId");

        ArgumentCaptor<Apex> apexArgumentCaptor =
                ArgumentCaptor.forClass(Apex.class);

        verify(apexRepository).save(apexArgumentCaptor.capture());
        verify(apexRepository).findById("someId");
        Apex actual = apexArgumentCaptor.getValue();
        Apex expected = new Apex(
                "someId",
                apiResponse.getGlobal().getApexNickName(),
                apiResponse.getGlobal().getRank().getRankScore(),
                apiResponse.getGlobal().getRank().getRankName(),
                (long) apiResponse.getTotal().get("wins_season_9").getValue(),
                (long) apiResponse.getTotal().get("kills_season_9").getValue(),
                ZonedDateTime.from(NOW)
                        .plusMinutes(10)
        );
        assertThat(expected).isEqualTo(actual);
    }

    @Test
    void cantUpdateStatsApexNoSeasonData() {
        Apex currentUser = new Apex(
                "someId",
                "someGameNickname",
                2950L,
                "Bronze",
                47L,
                241L,
                ZonedDateTime.from(NOW)
                        .minusMinutes(15)
        );
        Map<String,ApexApiResponse.Wins> stats = new HashMap<>();


        ApexApiResponse apiResponse = new ApexApiResponse(
                new ApexApiResponse.Global(
                        "someNickName",
                        new ApexApiResponse.Rank(
                                18300L,
                                "Master",
                                "1"
                        )
                ),
                stats
        );

        when(clock.instant())
                .thenReturn(NOW.toInstant());
        when(clock.getZone())
                .thenReturn(NOW.getZone());
        when(apexRepository.findById(any()))
                .thenReturn(Optional.of(currentUser));
        when(apexApiService.getDataApex(any(),any()))
                .thenReturn(apiResponse);

        assertThatThrownBy(()-> underTest.updateStatsApex("someId"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No Stats Found");
    }

    @Test
    void cantUpdateStatsApexUserIdMissing() {
        assertThatThrownBy(()-> underTest.updateStatsApex(""))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()-> underTest.updateStatsApex(null))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }

    @Test
    void cantUpdateUserStatsUserIdNotFound() {
        when(apexRepository.findById(any()))
                .thenReturn(Optional.empty());
        assertThatThrownBy(()-> underTest.updateStatsApex("someId"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User Does Not Exists");
        verify(apexRepository).findById(any());
    }

    @Test
    void canSaveNewUserStats() {
        Apex expected = new Apex(
                "someId",
                "someNickName",
                2950L,
                "Bronze",
                47L,
                241L,
                ZonedDateTime.from(NOW)
                        .plusMinutes(10)
        );
        Map<String,ApexApiResponse.Wins> stats = new HashMap<>();
        stats.put("wins_season_10", new ApexApiResponse.Wins(47L));
        stats.put("wins_season_9", new ApexApiResponse.Wins(101L));
        stats.put("wins_season_8", new ApexApiResponse.Wins(11L));
        stats.put("kills_season_10", new ApexApiResponse.Wins(241L));
        stats.put("kills_season_9", new ApexApiResponse.Wins(120L));
        stats.put("kills_season_8", new ApexApiResponse.Wins(1034L));

        ApexApiResponse apiResponse = new ApexApiResponse(
                new ApexApiResponse.Global(
                        "someNickName",
                        new ApexApiResponse.Rank(
                                2950L,
                                "Bronze",
                                "1"
                        )
                ),
                stats
        );

        when(clock.instant())
                .thenReturn(NOW.toInstant());
        when(clock.getZone())
                .thenReturn(NOW.getZone());

        when(apexRepository.existsById(any()))
                .thenReturn(false);
        when(apexRepository.existsByGameNicknameIgnoreCase(any()))
                .thenReturn(false);
        when(apexApiService.getDataApex(any(),any()))
                .thenReturn(apiResponse);

        underTest.saveNewUserStats("someId",
                "someNickName");

        ArgumentCaptor<Apex> apexArgumentCaptor =
                ArgumentCaptor.forClass(Apex.class);

        verify(apexRepository).save(apexArgumentCaptor.capture());
        verify(apexRepository).existsById("someId");
        verify(apexRepository).existsByGameNicknameIgnoreCase("someNickName");
        Apex actual = apexArgumentCaptor.getValue();

        assertThat(expected).isEqualTo(actual);
    }

    @Test
    void cantSaveNewUserUserIdMissing() {
        assertThatThrownBy(()-> underTest.saveNewUserStats("", "someNickName"))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()-> underTest.saveNewUserStats(null, "someNickName"))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }
    @Test
    void cantSaveNewUserApexNickNameMissing() {
        assertThatThrownBy(()-> underTest.saveNewUserStats("someId", ""))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("Apex Nick Name Id Missing");
        assertThatThrownBy(()-> underTest.saveNewUserStats("someId", null))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("Apex Nick Name Id Missing");
    }

    @Test
    void cantSaveNewUserStatsUserAlreadyPresent() {
        given(apexRepository.existsById(any()))
                .willReturn(true);

        assertThatThrownBy(()->underTest.saveNewUserStats("someUsername", "someId"))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("User Already Exists");
        verify(apexRepository).existsById(any());
    }

    @Test
    void cantSaveNewUserStatsGameNickNameAlreadyTaken() {
        when(apexRepository.existsById(any()))
                .thenReturn(false);
        when(apexRepository.existsByGameNicknameIgnoreCase(any()))
                .thenReturn(true);

        assertThatThrownBy(()->underTest.saveNewUserStats("someUsername", "someId"))
                .isInstanceOf(NickNameAlreadyExistsException.class)
                .hasMessageContaining("Nick Name Already Exists");
        verify(apexRepository).existsById(any());
        verify(apexRepository).existsByGameNicknameIgnoreCase(any());
    }

 /*   @Test
    void canUpdateApexNickName() {
        Apex expected = new Apex(
                "someId",
                "oldGameNickName",
                2950L,
                "Bronze",
                47L,
                200L,
                ZonedDateTime.from(NOW)
        );

        Map<String,ApexApiResponse.Wins> stats = new HashMap<>();
        stats.put("wins_season_10", new ApexApiResponse.Wins(47L));
        stats.put("wins_season_9", new ApexApiResponse.Wins(101L));
        stats.put("wins_season_8", new ApexApiResponse.Wins(11L));
        stats.put("kills_season_10", new ApexApiResponse.Wins(200L));
        stats.put("kills_season_9", new ApexApiResponse.Wins(120L));
        stats.put("kills_season_8", new ApexApiResponse.Wins(1034L));

        ApexApiResponse apiResponse = new ApexApiResponse(
                new ApexApiResponse.Global(
                        "newGameNickName",
                        new ApexApiResponse.Rank(
                                2950L,
                                "Bronze",
                                "1"
                        )
                ),
                stats
        );

        when(clock.instant())
                .thenReturn(NOW.toInstant());
        when(clock.getZone())
                .thenReturn(NOW.getZone());

        when(apexRepository.findById(any()))
                .thenReturn(Optional.of(expected));
        when(apexRepository.existsByGameNicknameIgnoreCase("newGameNickName"))
                .thenReturn(false);

        when(apexApiService.getDataApex(any(),any()))
                .thenReturn(apiResponse);

        underTest.updateApexNickName("someId",

                "newGameNickName");

        ArgumentCaptor<Apex> apexArgumentCaptor =
                ArgumentCaptor.forClass(Apex.class);

        verify(apexRepository).findById("someId");
        verify(apexRepository).existsByGameNicknameIgnoreCase("newGameNickName");
        verify(apexRepository).save(apexArgumentCaptor.capture());

        Apex actual = apexArgumentCaptor.getValue();
        expected.setTimestamp(ZonedDateTime.from(NOW
                .plusMinutes(10)));
        assertThat(expected).isEqualTo(actual);
    }*/
/*

    @Test
    void cantUpdateGameNickNameUserNotFound() {
        given(apexRepository.findById(any())).
                willReturn(Optional.empty());

        assertThatThrownBy(()->underTest.updateApexNickName("someId",

                "newNickName"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User Not Present in Database");
        verify(apexRepository).findById(any());
    }

    @Test
    void cantUpdateGameNickNameOldNickNameDoesntMatch() {
        Apex apex = new Apex();
        apex.setId("someId");
        apex.setGameNickname("someOtherNickName");
        given(apexRepository.findById(any())).
                willReturn(Optional.of(apex));

        assertThatThrownBy(()->underTest.updateApexNickName("someId",

                "newNickName"))
                .isInstanceOf(NickNameNotMatchingException.class)
                .hasMessageContaining("Illegal Access from User");
        verify(apexRepository).findById(any());
    }

    @Test
    void cantUpdateGameNickNameUserIdMissing() {
        assertThatThrownBy(()-> underTest.updateApexNickName("", any()))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
        assertThatThrownBy(()-> underTest.updateApexNickName("",any()))
                .isInstanceOf(UserIdMissingException.class)
                .hasMessageContaining("User Id Missing");
    }

    @Test
    void cantUpdateGameNickNameOldApexNickNameMissing() {
        assertThatThrownBy(()-> underTest
                .updateApexNickName("someId",  "someApexNickName"))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("Old Apex Nick Name Id Missing");
        assertThatThrownBy(()-> underTest
                .updateApexNickName("someId","someApexNickName"))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("Old Apex Nick Name Id Missing");
    }

    @Test
    void cantUpdateGameNickNameNewApexNickNameMissing() {
        assertThatThrownBy(()-> underTest
                .updateApexNickName("someId", "oldNickName"))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("New Apex Nick Name Id Missing");
        assertThatThrownBy(()-> underTest
                .updateApexNickName("someId","oldNickName"))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("New Apex Nick Name Id Missing");
    }

    @Test
    void cantUpdateGameNickNameNewNickNameAlreadyPresentInDataBase() {
        Apex apex = new Apex();
        apex.setId("someId");
        apex.setGameNickname("oldNickName");
        given(apexRepository.findById(any())).
                willReturn(Optional.of(apex));
        given(apexRepository.existsByGameNicknameIgnoreCase(any()))
                .willReturn(true);

        assertThatThrownBy(()->underTest.updateApexNickName("someId",
                "newNickName"))
                .isInstanceOf(NickNameAlreadyExistsException.class)
                .hasMessageContaining("New Apex NickName Already Exists in Database");
        verify(apexRepository).findById(any());
        verify(apexRepository).existsByGameNicknameIgnoreCase(any());
    }
*/

    @Test
    void canGetStats(){
        Apex expected = new Apex(
                "someId",
                "someGameNickName",
                2950L,
                "Bronze",
                47L,
                241L,
                ZonedDateTime.from(NOW)
        );

        when(apexRepository.findByGameNicknameIgnoreCase(any()))
                .thenReturn(Optional.of(expected));

        Apex actual = underTest.getStats("someGameNickName");

        verify(apexRepository).findByGameNicknameIgnoreCase(any());
        assertThat(expected).isEqualTo(actual);
    }

    @Test
    void cantGetStatsNickNameNotFound(){

        when(apexRepository.findByGameNicknameIgnoreCase(any()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(()->underTest.getStats("someGameNickName"))
                .isInstanceOf(NickNameNotFoundException.class)
                .hasMessageContaining("Apex Nick Name Not Found");
        verify(apexRepository).findByGameNicknameIgnoreCase(any());
    }

    @Test
    void cantGetStatsNickNameMissing() {
        assertThatThrownBy(()-> underTest.getStats(""))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("Apex Nick Name Id Missing");
        assertThatThrownBy(()-> underTest.getStats(null))
                .isInstanceOf(NickNameMissingException.class)
                .hasMessageContaining("Apex Nick Name Id Missing");
    }
}