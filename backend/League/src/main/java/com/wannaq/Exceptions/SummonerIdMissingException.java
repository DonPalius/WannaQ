package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class SummonerIdMissingException extends RuntimeException {
    public SummonerIdMissingException(String message) {
        super(message);
    }
}
