package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ApiKeyMissingException extends RuntimeException {
    public ApiKeyMissingException(String message) {
        super(message);
    }
}
