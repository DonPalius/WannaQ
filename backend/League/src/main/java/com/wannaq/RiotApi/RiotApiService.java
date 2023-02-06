package com.wannaq.RiotApi;

import com.wannaq.Exceptions.ApiKeyMissingException;
import com.wannaq.Exceptions.SummonerIdMissingException;
import com.wannaq.Exceptions.SummonerNameMissingException;
import com.wannaq.league.League;
import com.wannaq.league.LeagueController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class RiotApiService {
    private final Logger LOGGER = LoggerFactory.getLogger(RiotApiService.class);

    private final WebClient riotApiClient;

    @Autowired
    public RiotApiService(WebClient riotApiClient) {
        this.riotApiClient = riotApiClient;
    }

    public RiotApiAccountInfo getIdsLeague(String summonerName, String apiKey){
        if (apiKey == null || apiKey.isEmpty())
            throw new ApiKeyMissingException("API KEY Missing");
        if (summonerName == null || summonerName.isEmpty())
            throw new SummonerNameMissingException("SummonerName Missing");
        LOGGER.info(apiKey);

        return riotApiClient
                .get()
                .uri("summoner/v4/summoners/by-name/"+ summonerName)
                .header("X-Riot-Token", apiKey)
                .retrieve()
                .bodyToMono(RiotApiAccountInfo.class)
                .blockOptional()
                .orElseThrow(()-> new IllegalStateException("Error RIOT API"));
    }


    public List<RiotApiSummonerStats> getRiotApiStats(String summonerId, String apiKey)  {
        if (apiKey == null || apiKey.isEmpty())
            throw new ApiKeyMissingException("API KEY Missing");
        if (summonerId == null || summonerId.isEmpty())
            throw new SummonerIdMissingException("Account ID Missing");
        LOGGER.info(apiKey);
        return riotApiClient
                .get()
                .uri("league/v4/entries/by-summoner/"+ summonerId)
                .header("X-Riot-Token", apiKey)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<RiotApiSummonerStats>>() {
                })
                .blockOptional()
                .orElseThrow(()-> new IllegalStateException("Error RIOT API"));
    }
}
