package com.wannaq.league;


import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/v1/league")
// TODO Make endpoints return consistent objects

public class LeagueController {
    private final Logger LOGGER = LoggerFactory.getLogger(LeagueController.class);
    private final LeagueService leagueService;
    @Autowired
    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @GetMapping("/{summonerName}")
    public League getStats(@PathVariable("summonerName") String summonerName){
        LOGGER.info(String.format("NickName: %s", summonerName));
        League summoner = leagueService.getStats(summonerName);
        LOGGER.info(String.valueOf(summoner));
        return summoner;
    }

    // Saves the new User in Database
    @PostMapping("/registerNewUser/{summonerName}")
    public void registerNewUser(@PathVariable("summonerName") String summonerName,
                                     @RequestHeader("x-user") String userId) {
        LOGGER.info(String.format("NickName: %s", summonerName));
        LOGGER.info(String.format("User-Id: %s", userId));
        leagueService.saveNewUser(summonerName, userId);
    }

    // Find Users with compatible stats in soloQ
    // Returns List of Stats of compatible Users
    @GetMapping("/find-mate/soloQ")
    public List<League> getMatchSoloQ(@RequestHeader("x-user") String userId) {
        return leagueService.getSoloQ(userId);
    }

    // Find Users with compatible stats in FlexQ
    // Returns List of Stats of compatible Users
    @GetMapping("/find-mate/flexQ")
    public List<League> getMatchFlex(@RequestHeader("x-user") String userId) {
        return leagueService.getFlexQ(userId);
    }

    // Update SummonerName and updateStats
    @RequestMapping(value = "/updateSummonerName/{newLeagueNickname}", method = RequestMethod.GET)
    public void updateNick(@RequestHeader("x-user") String userId,
                           @PathVariable("newLeagueNickname") String newLeagueNickname) {
        leagueService.updateSummonerName(userId,
                (String) newLeagueNickname);
    }


    // Update Stats
    // Returns saved Stats if timestamp not expired
    // Calls RIOT API and updates saved Stats otherwise
    @PutMapping("/updateStats")
    public void updateStatsLeague(@RequestHeader("x-user")String userId) {
        leagueService.updateStatsLeague(userId);
    }



}
