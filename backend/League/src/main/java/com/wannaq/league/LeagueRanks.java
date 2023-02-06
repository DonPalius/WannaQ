package com.wannaq.league;

import java.util.HashMap;
import java.util.Map;

public class LeagueRanks {

    public static Map<String, Integer> getRanks() {
        Map<String, Integer> ranks = new HashMap<>();
        ranks.put("IRON_IV",0);
        ranks.put("IRON_III",100);
        ranks.put("IRON_II",200);
        ranks.put("IRON_I",300);
        ranks.put("BRONZE_IV",400);
        ranks.put("BRONZE_III",500);
        ranks.put("BRONZE_II",600);
        ranks.put("BRONZE_I",700);
        ranks.put("SILVER_IV",800);
        ranks.put("SILVER_III",900);
        ranks.put("SILVER_II",1000);
        ranks.put("SILVER_I",1100);
        ranks.put("GOLD_IV",1200);
        ranks.put("GOLD_III",1300);
        ranks.put("GOLD_II",1400);
        ranks.put("GOLD_I",1500);
        ranks.put("PLATINUM_IV",1600);
        ranks.put("PLATINUM_III",1700);
        ranks.put("PLATINUM_II",1800);
        ranks.put("PLATINUM_I",1900);
        ranks.put("DIAMOND_IV",2000);
        ranks.put("DIAMOND_III",2100);
        ranks.put("DIAMOND_II",2200);
        ranks.put("DIAMOND_I",2300);
        ranks.put("MASTER_I",2300);
        ranks.put("GRANDMASTER_I",2300);
        ranks.put("CHALLENGER_I",2300);
        return ranks;
    }

}
