package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class SummonerNameMissingException extends RuntimeException {

    public SummonerNameMissingException(String message) {
        super(message);
    }

}
