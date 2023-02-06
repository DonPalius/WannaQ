package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class SummonerNameAlreadyExistsException extends RuntimeException {
    public SummonerNameAlreadyExistsException(String message) {
        super(message);
    }

}
