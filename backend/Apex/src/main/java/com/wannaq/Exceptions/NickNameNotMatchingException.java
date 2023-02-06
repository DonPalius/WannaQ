package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class NickNameNotMatchingException extends RuntimeException {
    public NickNameNotMatchingException(String message) {
        super(message);
    }
}
