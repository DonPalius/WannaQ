package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class UserIdMissingException extends RuntimeException{
    public UserIdMissingException(String message) {
        super(message);
    }
}
