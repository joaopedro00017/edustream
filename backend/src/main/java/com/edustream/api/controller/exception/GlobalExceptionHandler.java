package com.edustream.api.controller.exception;

import com.edustream.api.domain.exception.ConflictException;
import com.edustream.api.domain.exception.CustomAccessDeniedException;
import com.edustream.api.domain.exception.InvalidCredentialsException;
import com.edustream.api.domain.exception.ResourceNotFoundException;
import com.edustream.api.dto.RestErrorDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Captura quando um curso, módulo ou lição não existem (Status 404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<RestErrorDTO> handleResourceNotFound(ResourceNotFoundException exception) {
        RestErrorDTO errorDTO = new RestErrorDTO(Instant.now(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorDTO);
    }

    // Captura quando o instrutor tenta mexer em algo que não é dele (Status 403)
    @ExceptionHandler(CustomAccessDeniedException.class)
    public ResponseEntity<RestErrorDTO> handleAccessDenied(CustomAccessDeniedException exception) {
        RestErrorDTO errorDTO = new RestErrorDTO(Instant.now(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorDTO);
    }

    // Captura credenciais inválidas no login (Status 401)
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<RestErrorDTO> handleInvalidCredentials(InvalidCredentialsException exception) {
        RestErrorDTO errorDTO = new RestErrorDTO(Instant.now(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorDTO);
    }

    // Captura conflitos de estado, como e-mail ou matrícula duplicados (Status 409)
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<RestErrorDTO> handleConflict(ConflictException exception) {
        RestErrorDTO errorDTO = new RestErrorDTO(Instant.now(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorDTO);
    }

    // Mecanismo de segurança genérico para outros erros inesperados (Status 400)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<RestErrorDTO> handleRuntimeException(RuntimeException exception) {
        RestErrorDTO errorDTO = new RestErrorDTO(Instant.now(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDTO);
    }
}