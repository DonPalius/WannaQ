package com.wannaq.ApexAPI;

import com.wannaq.Exceptions.ApiKeyMissingException;
import com.wannaq.Exceptions.NickNameMissingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ApexApiService {
    private final WebClient apexApiClient;

    @Autowired
    public ApexApiService(WebClient apexApiClient) {
        this.apexApiClient = apexApiClient;
    }


    public ApexApiResponse getDataApex(String gameNickname, String apiKey) {
        if (apiKey == null || apiKey.isEmpty())
            throw new ApiKeyMissingException("API KEY Missing");
        if (gameNickname == null || gameNickname.isEmpty())
            throw new NickNameMissingException("Game NickName Missing");

        return apexApiClient
                .get()
                .uri("/bridge?version=5&platform=PC&player=" + gameNickname + "&auth=" + apiKey)
                .retrieve()
                .bodyToMono(ApexApiResponse.class)
                .blockOptional()
                .orElseThrow(() -> new IllegalStateException("Error Apex Api"));
    }
}
