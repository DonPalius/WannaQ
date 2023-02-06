package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class SummonerNameNotMatchingException extends RuntimeException {
    public SummonerNameNotMatchingException(String message) {
        super(message);
    }

}
