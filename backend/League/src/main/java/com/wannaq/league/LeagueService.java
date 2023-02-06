package com.wannaq.league;


import com.wannaq.Exceptions.*;
import com.wannaq.RiotApi.RiotApiAccountInfo;
import com.wannaq.RiotApi.RiotApiService;
import com.wannaq.RiotApi.RiotApiSummonerStats;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Clock;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static java.lang.Math.abs;

@Service
public class LeagueService {

    @Value(value = "${games.key}")
    private String apikey;
    private final Logger LOGGER = LoggerFactory.getLogger(LeagueService.class);
    private final LeagueRepository leagueRepository;
    private final RiotApiService riotApiService;
    private final Clock clock;

    @Autowired
    public LeagueService(LeagueRepository leagueRepository,
                         RiotApiService riotApiService,
                         Clock clock) {
        this.leagueRepository = leagueRepository;
        this.riotApiService = riotApiService;
        this.clock = clock;
    }

    public List<League> getSoloQ(String id) {
        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");
        // Finds Current User Statas
        League currentUserStats = leagueRepository
                .findById(id)
                .orElseThrow(()-> new UserNotFoundException("User Does Not Exists"));

        // Finds Stats of all Users minus Current User
        List<League> allUsr = leagueRepository.findAllByIdNot(id);

        if (allUsr.isEmpty())
            return allUsr;
        Map<String, Integer> RANKS = LeagueRanks.getRanks();
        AtomicInteger currentUserLp = new AtomicInteger();

        // Check if  currentUser has rankSoloq
        // If it has Rank, Set currentUserLp to sum of Rank Points and Current League Points
        // If Not Sets CurrentUserLp to 1200 (Equivalent to Gold 1 Rank)

        if (currentUserStats.getRanksoloq() == null|| currentUserStats.getRanksoloq().isEmpty())
            currentUserLp.set(1200);
        else
            currentUserLp.set((int) abs(currentUserStats.getPointsoloq()+
                    RANKS.get(currentUserStats.getRanksoloq())));
        // Check if elo difference between every user and
        // Current User is less than 500 points
        // If those conditions are verified adds User to resultList
        // Then sorts the list on the difference between current userLp and the selected user
        // Return the first 10 results
        return allUsr
                .stream()
                .filter(league -> abs(currentUserLp.get() -
                        (league.getRanksoloq() == null || league.getRanksoloq().isEmpty() ?
                                1200:(RANKS.get(league.getRanksoloq()) + league.getPointsoloq())))
                        <= 500
                ).sorted(Comparator.comparing(league -> abs(
                        (league.getRanksoloq() == null || league.getRanksoloq().isEmpty()?
                                1200 : (RANKS.get(league.getRanksoloq())+ league.getPointsoloq()))
                                -currentUserLp.get())))
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<League> getFlexQ(String id) {
        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");

        // TODO Manage case currentUser rankFlex == null
        // Finds Current User Statas
        League currentUserStats = leagueRepository
                .findById(id)
                .orElseThrow(()-> new UserNotFoundException("User Does Not Exists"));

        // Finds Stats of all Users minus Current User
        List<League> allUsr = leagueRepository.findAllByIdNot(id);

        if (allUsr.isEmpty())
            return allUsr;

        Map<String, Integer> RANKS = LeagueRanks.getRanks();
        AtomicInteger currentUserLp = new AtomicInteger();

        // Check if  currentUser has rankFlex
        // If it has Rank, Set currentUserLp to sum of Rank Points and Current League Points
        // If Not Sets CurrentUserLp to 1200 (Equivalent to Gold 1 Rank)

        if (currentUserStats.getRankflex() == null||
                currentUserStats.getRankflex().isEmpty())
            currentUserLp.set(1200);
        else
            currentUserLp.set((int) abs(currentUserStats.getPointflex()+
                    RANKS.get(currentUserStats.getRankflex())));

        // Check if elo difference between every user and
        // Current User is less than 500 points
        // If those conditions are verified adds User to resultList
        // Then sorts the list on the difference between current userLp and the selected user
        // Return the first 10 results
        return allUsr
                .stream()
                .filter(league -> abs(currentUserLp.get() -
                        (league.getRankflex() == null || league.getRankflex().isEmpty() ?
                                1200 : (RANKS.get(league.getRankflex()) + league.getPointflex()) ))
                        <= 500
                ).sorted(Comparator.comparing(league -> abs(
                        (league.getRankflex() == null || league.getRankflex().isEmpty()?
                                1200 : (RANKS.get(league.getRankflex())+ league.getPointflex()))
                        -currentUserLp.get())))
                .limit(10)
                .collect(Collectors.toList());
    }


    // If Timestamp is expired calls Riot Api and updates stats
    @Transactional
    public void updateStatsLeague(String id) {

        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");

        League league = leagueRepository.findById(id)
                        .orElseThrow(()->new UserNotFoundException("User Does Not Exist"));

        if (league.getTimestamp()
                .isBefore(ZonedDateTime.now(clock))){
            List<RiotApiSummonerStats> riotApiStats = riotApiService
                    .getRiotApiStats(league.getSummonerId(), apikey);

            league.setRankflex(null);
            league.setWinsflex(null);
            league.setLossflex(null);
            league.setPointflex(null);
            league.setRanksoloq(null);
            league.setWinssoloq(null);
            league.setLossesoloq(null);
            league.setPointsoloq(null);

            riotApiStats.forEach(leagueSummonerStats -> {
                        if (leagueSummonerStats.getQueueType()
                                .equalsIgnoreCase("RANKED_SOLO_5x5")){
                            league.setRanksoloq(String.format("%s_%s",
                                    leagueSummonerStats.getTier(),
                                    leagueSummonerStats.getRank()));
                            league.setWinssoloq(leagueSummonerStats.getWins());
                            league.setLossesoloq(leagueSummonerStats.getLosses());
                            league.setPointsoloq(leagueSummonerStats.getLeaguePoints());
                        }else {
                            league.setRankflex(String.format("%s_%s",
                                    leagueSummonerStats.getTier(),
                                    leagueSummonerStats.getRank()));
                            league.setWinsflex(leagueSummonerStats.getWins());
                            league.setLossflex(leagueSummonerStats.getLosses());
                            league.setPointflex(leagueSummonerStats.getLeaguePoints());
                        }
                    }
            );

            // Refresh Timestamp
            LOGGER.info("Update Timestamp");
            league.setTimestamp(ZonedDateTime.now(clock)
                    .plusMinutes(10));
            // Save New Stats
            leagueRepository.save(league);
        }
    }




    // Registers Users if Not Present
    // Updates Stats if timestamp Expires
    // Returns Stats Currently saved in database otherwise
    @Transactional
    public void saveNewUser(String summonerName, String id) {

        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");
        if (summonerName == null || summonerName.isEmpty())
            throw new SummonerNameMissingException("Summoner Name Missing");

        if (leagueRepository.existsById(id))
            throw new UserAlreadyExistsException("User Already Exists in Database");
        if (leagueRepository.existsBySummonernameIgnoreCase(summonerName))
            throw new SummonerNameAlreadyExistsException("Summoner Already Exists in Database");

        League league = new League();

        // Gets Ids From Riot API
        // Saves Ids In League Object
        getSummonerData(summonerName, league);


        // Gets Stats from Riot Api
        // Saves Stats In League Object
        List<RiotApiSummonerStats> riotApiStats = riotApiService.getRiotApiStats(league.getSummonerId(), apikey);

        riotApiStats.forEach(leagueSummonerStats -> {
                    if (leagueSummonerStats.getQueueType().equals("RANKED_SOLO_5x5")){
                        league.setRanksoloq(String.format("%s_%s",
                                leagueSummonerStats.getTier(),
                                leagueSummonerStats.getRank()));
                        league.setWinssoloq(leagueSummonerStats.getWins());
                        league.setLossesoloq(leagueSummonerStats.getLosses());
                        league.setPointsoloq(leagueSummonerStats.getLeaguePoints());
                    }else{
                        league.setRankflex(String.format("%s_%s",
                                leagueSummonerStats.getTier(),
                                leagueSummonerStats.getRank()));
                        league.setWinsflex(leagueSummonerStats.getWins());
                        league.setLossflex(leagueSummonerStats.getLosses());
                        league.setPointflex(leagueSummonerStats.getLeaguePoints());
                    }
                }
        );

        // Set Firebase User Id
        league.setId(id);

        // Set Stats Timestamp
        // Stats Expire in 10 minutes

        league.setTimestamp(ZonedDateTime.now(clock)
                .plusMinutes(10));

        leagueRepository.save(league);
    }


    @Transactional
    public void updateSummonerName(String id , String newSummonerName) {
        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");



        if (newSummonerName == null || newSummonerName.isEmpty())
            throw new SummonerNameMissingException("New Summoner Name Missing");



        League league = leagueRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException("User Not Present In Database"));

        if (league.getSummonername().equalsIgnoreCase(newSummonerName))
            throw new SummonerNameNotMatchingException("nickname already exist");

        if (leagueRepository.existsBySummonernameIgnoreCase(newSummonerName))
            throw new SummonerNameAlreadyExistsException("New Summoner Name Already Exist In Database");
        getSummonerData(newSummonerName, league);


        List<RiotApiSummonerStats> riotApiStats = riotApiService
                .getRiotApiStats(league.getSummonerId(), apikey);

        // Update stats

        league.setRankflex(null);
        league.setWinsflex(null);
        league.setLossflex(null);
        league.setPointflex(null);
        league.setRanksoloq(null);
        league.setWinssoloq(null);
        league.setLossesoloq(null);
        league.setPointsoloq(null);

        riotApiStats.forEach(leagueSummonerStats -> {
                    if (leagueSummonerStats.getQueueType().equals("RANKED_SOLO_5x5")){
                        league.setRanksoloq(String.format("%s_%s",
                                leagueSummonerStats.getTier(),
                                leagueSummonerStats.getRank()));
                        league.setWinssoloq(leagueSummonerStats.getWins());
                        league.setLossesoloq(leagueSummonerStats.getLosses());
                        league.setPointsoloq(leagueSummonerStats.getLeaguePoints());
                    }else {
                        league.setRankflex(String.format("%s_%s",
                                leagueSummonerStats.getTier(),
                                leagueSummonerStats.getRank()));
                        league.setWinsflex(leagueSummonerStats.getWins());
                        league.setLossflex(leagueSummonerStats.getLosses());
                        league.setPointflex(leagueSummonerStats.getLeaguePoints());
                    }
                }
        );
        LOGGER.info(league+  " LEAGUE");
        // set Timestamp
        league.setTimestamp(ZonedDateTime.now(clock)
                .plusMinutes(10));

        leagueRepository.save(league);
    }

    private void getSummonerData(String newSummonerName, League league) {
        RiotApiAccountInfo accountInfo = riotApiService.getIdsLeague(newSummonerName
                .replaceAll("\\s",""),apikey);

        league.setSummonername(accountInfo.getName());
        league.setAccountId(accountInfo.getAccountId());
        league.setPuuid(accountInfo.getPuuid());
        league.setSummonerLevel(accountInfo.getSummonerLevel());
        league.setSummonerId(accountInfo.getId());
    }



    public League getStats(String summonerName) {

        if (summonerName == null || summonerName.isEmpty())
            throw new SummonerNameMissingException("Summoner Name Missing");

        return leagueRepository.findBySummonernameIgnoreCase(summonerName)
                .orElseThrow(()-> new SummonerNameNotFoundException("Summoner Not Found"));
    }
}
