package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class SummonerNameNotFoundException extends RuntimeException {

    public SummonerNameNotFoundException(String message) {
        super(message);
    }

}
