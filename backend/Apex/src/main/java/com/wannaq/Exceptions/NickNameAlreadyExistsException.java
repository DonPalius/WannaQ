package com.wannaq.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class NickNameAlreadyExistsException extends RuntimeException{
    public NickNameAlreadyExistsException(String message) {
        super(message);
    }
}
