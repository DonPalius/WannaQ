package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NickNameNotFoundException extends RuntimeException {
    public NickNameNotFoundException(String message) {
        super(message);
    }
}
