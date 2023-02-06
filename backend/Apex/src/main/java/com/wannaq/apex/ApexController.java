package com.wannaq.apex;


import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/apex")
@CrossOrigin(origins = "http://localhost:3000")

public class ApexController {
    private final ApexService apexService;

    @Autowired
    public ApexController(ApexService apexService) {
        this.apexService = apexService;
    }


    //  Find Users with compatible stats
    //  Returns List of Stats of Compatible Users

    @GetMapping("/{apexNickName}")
    public Apex getStats(@PathVariable("apexNickName") String apexNickName){
        return apexService.getStats(apexNickName);
    }

    @GetMapping("/find-mate")
    public List<Apex> getMatch (@RequestHeader("x-user")String userId){
        return apexService.getMatch(userId);
    }

    @PutMapping("/updateStats")
    public void updateStatsApi(@RequestHeader("x-user") String userId) {
        apexService.updateStatsApex(userId);
    }

    @PostMapping("/registerNewUser/{apexNickName}")
    public void registerNewUser(@RequestHeader("x-user") String userId,
                                            @PathVariable("apexNickName") String apexNickName) {

          apexService.saveNewUserStats(userId, apexNickName);
    }


    // TODO Modify Json In frontend
    @RequestMapping(value = "/updateNickName/{newApexNickName}", method = RequestMethod.POST)
    public void updateDbStats(@RequestHeader("x-user") String userId,
                              @PathVariable("newApexNickName") String newApexNickName) {
        apexService.updateApexNickName(userId,
                (String)newApexNickName);
    }
}
