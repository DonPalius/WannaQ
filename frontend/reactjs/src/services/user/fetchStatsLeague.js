import axios from "axios";
import data from "bootstrap/js/src/dom/data";
import request from "../request";

const BASE_URL_LEAGUE = "http://wannaq.me/api/v1/league/";

class fetchStatsLeague {
  getStatsLeague(gamenickname) {
    console.log("Fetching stats");
    // return axios.get(BASE_URL_LEAGUE+"statsUsr/"+gamenickname)
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return request(BASE_URL_LEAGUE + gamenickname, options);
  }
  registerNewUser(gamenickname) {
    // return axios.get(BASE_URL_LEAGUE+"statsUsr/"+gamenickname)
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return request(
      BASE_URL_LEAGUE + "registerNewUser/" + gamenickname,
      options
    );
  }

  getMatchLeagueFlex() {
    // return axios.get(BASE_URL_LEAGUE+"getMatchFlex/"+ id)
    return request(BASE_URL_LEAGUE + "find-mate/flexQ", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  getMatchLeagueSolo() {
    // return axios.get(BASE_URL_LEAGUE+"getMatchSoloQ/"+ id)
    return request(BASE_URL_LEAGUE + "find-mate/soloQ", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  updateLeagueStats() {
    // return axios.get(BASE_URL_LEAGUE+"getMatchSoloQ/"+ id)
    return request(BASE_URL_LEAGUE + "updateStats", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  /*    getStatsApi(summonerName){
        if(summonerName){
            return fetch(BASE_URL_LEAGUE+"leagueIds/"+summonerName)
        }else{
            return null;
        }


    }*/

  updateNickname(newSummonerName) {
    return request(BASE_URL_LEAGUE + "updateSummonerName/" + newSummonerName, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
}

export default new fetchStatsLeague();
