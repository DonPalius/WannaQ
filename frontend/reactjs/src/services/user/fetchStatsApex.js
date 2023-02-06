import getApexStats from "axios";
import request from "../request";

const BASE_URL_APEX = "http://wannaq.me/api/v1/apex/";

class fetchStatsApex {
  createUser(gamenickname) {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return request(BASE_URL_APEX + "registerNewUser/" + gamenickname, options);
  }

  getApexStats(apexNickName) {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return request(BASE_URL_APEX + apexNickName, options);
  }

  getAllStats(token) {
    return getApexStats.get(BASE_URL_APEX + "userstats", {
      headers: {
        Authorization: token,
        dataType: "json",
      },
    });
  }

  getMatchApex(id) {
    return request(BASE_URL_APEX + "find-mate", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  upUsr(userData) {
    console.log("upUsr", userData);
    return request(BASE_URL_APEX + "updateNickName/" + userData, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("profile is:", res.data);
      })
      .catch((error) => console.log(error));
  }

  getStatsById(userId, token) {
    return getApexStats.get(BASE_URL_APEX + "statsUser/" + userId, {
      headers: { dataType: "json", contentType: "application/json" },
    });
  }
}

export default new fetchStatsApex();
