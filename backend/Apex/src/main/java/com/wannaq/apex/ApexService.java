package com.wannaq.apex;

import com.wannaq.ApexAPI.ApexApiResponse;
import com.wannaq.ApexAPI.ApexApiService;
import com.wannaq.Exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.awt.*;
import java.time.Clock;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static java.lang.Math.abs;

@Service
public class ApexService {
    @Value("${apex.key}")
    private String apiKey;

    private final ApexRepository apexRepository;
    private final ApexApiService apexApiService;

    private final Clock clock;
    
    @Autowired
    public ApexService(ApexRepository apexRepository, ApexApiService apexApiService, Clock clock) {
        this.apexRepository = apexRepository;
        this.apexApiService = apexApiService;
        this.clock = clock;
    }

    public List<Apex> getMatch(String id) {
        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");

        Apex currentUserStats = apexRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException("User Does Not Exists"));
        List<Apex> allUsr = apexRepository.findAllByIdNot(id);

        if (allUsr.isEmpty())
            return allUsr;

        Map<String, Integer> RANKS = ApexRanks.getRanks();
        AtomicInteger currentUserPoints = new AtomicInteger();
        String currentUserRank;

        // Check if  currentUser has rank
        // If it has Rank, Set currentUserPoints to sum of Rank Points and Current Apex Points
        // If Not Sets CurrentUserLp to 2800 (Equivalent to Gold Rank)

        if (currentUserStats.getRank() == null||
                currentUserStats.getRank().isEmpty()) {
            currentUserPoints.set(6800);
            currentUserRank = "Gold";
        }
        else {
            currentUserPoints.set(Math.toIntExact(currentUserStats.getRating()));
            currentUserRank = currentUserStats.getRank();
        }

        // Check if elo difference between every user and
        // Current User is less than the amount of elo points per rank
        // If those conditions are verified adds User to resultList
        // Then sorts the list on the difference between current userLp and the selected user
        // Return the first 10 results

        return allUsr
                .stream()
                .filter(apex -> abs((apex.getRank() == null || apex.getRank().isEmpty() ?
                                6800 : apex.getRating()) - currentUserPoints.get())
                        <= RANKS.get(currentUserRank)
                )
                .sorted(Comparator.comparingInt((Apex apex) ->
                                (int) (abs((apex.getRank() == null || apex.getRank().isEmpty()?
                                        6800 : apex.getRating())) - currentUserPoints.get()))
                        .reversed()
                )
                .limit(10)
                .collect(Collectors.toList());
    }


//    Updates stats in database with data from Apex Api
//    if the timestamp is older than 10 minutes

    public void updateStatsApex(String id) {
//        If no id is provided the method throws an Exception
        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");

//        Get data from database
//        throws an Exception if the id provided is not present in database
        Apex stats = apexRepository.findById(id)
                .orElseThrow(()->new UserNotFoundException("User Does Not Exists"));


//        check if current time is before the timestamp
//        if so it proceeds to call the apex API and updates the database
        if (stats.getTimestamp()
                .isBefore(ZonedDateTime.now(clock))){

            getApiData(stats.getGameNickname(), stats);

            // Refresh Timestamp
            stats.setTimestamp(ZonedDateTime.now(clock)
                    .plusMinutes(10));

            apexRepository.save(stats);
        }

    }



    public void saveNewUserStats(String id, String apexNickName) {
        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");
        if (apexNickName == null || apexNickName.isEmpty())
            throw new NickNameMissingException("Apex Nick Name Id Missing");

        if (apexRepository.existsById(id))
            throw new UserAlreadyExistsException("User Already Exists");
        
        if (apexRepository.existsByGameNicknameIgnoreCase(apexNickName))
            throw new NickNameAlreadyExistsException("Nick Name Already Exists");

        Apex stats = new Apex();


        getApiData(apexNickName, stats);

        stats.setId(id);
        stats.setTimestamp(ZonedDateTime.now(clock)
                .plusMinutes(10));
        apexRepository.save(stats);

    }
    
    @Transactional
    public void updateApexNickName(String id, String newApexNickName) {
        if (id == null || id.isEmpty())
            throw new UserIdMissingException("User Id Missing");
        if (newApexNickName == null || newApexNickName.isEmpty())
            throw new NickNameMissingException("New Apex Nick Name Id Missing");

        Apex stats = apexRepository.findById(id).
                orElseThrow(()-> new UserNotFoundException("User Not Present in Database"));

        if (stats.getGameNickname().equalsIgnoreCase(newApexNickName))
            throw new NickNameNotMatchingException("can't update same nickname");

        if (apexRepository.existsByGameNicknameIgnoreCase(newApexNickName))
            throw new NickNameAlreadyExistsException("New Apex NickName Already Exists in Database");

        getApiData(newApexNickName, stats);

        stats.setTimestamp(ZonedDateTime.now(clock)
                .plusMinutes(10));

        apexRepository.save(stats);
    }



    private void getApiData(String newApexNickName, Apex stats) {
        ApexApiResponse dataApex = apexApiService.getDataApex(newApexNickName, apiKey);

        stats.setGameNickname(newApexNickName);
        stats.setRating(dataApex.getGlobal().getRank().getRankScore());
        stats.setRank(dataApex.getGlobal().getRank().getRankName());
        System.out.println(stats);


        Map<String, ApexApiResponse.Wins> statsMap = dataApex.getTotal();


//            TODO: Improve this function
        int currentSeasonWins = 10;
        int currentSeasonKills = 10;

        while (!statsMap.containsKey("wins_season_"+currentSeasonWins) && currentSeasonWins>0){
            currentSeasonWins--;
        }
        while (!statsMap.containsKey("kills_season_"+currentSeasonKills) && currentSeasonKills>0){
            currentSeasonKills--;
        }


//            TODO: Add proprietary exception
        if (currentSeasonKills == 0 ||currentSeasonWins == 0)
            throw new IllegalStateException("No Stats Found");

        stats.setWins((long) statsMap
                .get("wins_season_"+currentSeasonWins)
                .getValue());

        stats.setKills((long) statsMap
                .get("kills_season_"+currentSeasonKills)
                .getValue());
    }

    public Apex getStats(String apexNickName) {
        if (apexNickName == null || apexNickName.isEmpty())
            throw new NickNameMissingException("Apex Nick Name Id Missing");

        return apexRepository.findByGameNicknameIgnoreCase(apexNickName)
                .orElseThrow(()-> new NickNameNotFoundException("Apex Nick Name Not Found"));


    }
}
