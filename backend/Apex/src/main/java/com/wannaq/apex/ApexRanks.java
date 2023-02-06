package com.wannaq.apex;

import java.util.HashMap;
import java.util.Map;

public class ApexRanks {

    public static Map<String,Integer> getRanks(){
        Map<String, Integer> ranks = new HashMap<>();
        ranks.put("Rookie",1000);
        ranks.put("Bronze",2000);
        ranks.put("Silver",2400);
        ranks.put("Gold",2800);
        ranks.put("Platinum",3200);
        ranks.put("Diamond", 3600);
        ranks.put("Master", 4000);
        ranks.put("Apex Predator", 4000);
        return ranks;
    }
}
