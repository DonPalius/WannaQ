package com.wannaq.RiotApi;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RiotApiAccountInfo {
    private String id;
    private String accountId;
    private String puuid;
    private String name;
    private Long profileIconID;
    private Long revisionDate;
    private Long summonerLevel;
}
