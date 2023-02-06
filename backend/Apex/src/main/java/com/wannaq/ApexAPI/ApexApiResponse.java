package com.wannaq.ApexAPI;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApexApiResponse {
    @JsonProperty("global")
    private Global global;
    @JsonProperty("total")
    private Map<String,Wins> total;
    public static class setSeason{
        private String name;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Global{
        @JsonProperty("name")
        private String apexNickName;
        @JsonProperty("rank")
        private Rank rank;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Rank{
        @JsonProperty("rankScore")
        private Long rankScore;
        @JsonProperty("rankName")
        private String rankName;
        @JsonProperty("rankDiv")
        private String rankDiv;
    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Wins {
        @JsonProperty("value")
        private double value;
    }



}


