package com.gupiluan.to_do_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.gupiluan.to_do_backend.model.ApiResponse;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the ToDo application.
 * Provides consistent error responses across all endpoints.
 * 
 * @author gupiluan
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles validation errors from request body validation.
     * 
     * @param ex the validation exception
     * @return ResponseEntity with validation error details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiResponse<Map<String, String>> response = ApiResponse.error("Validation failed");
        response.setData(errors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles ToDo not found exceptions.
     * 
     * @param ex the not found exception
     * @return ResponseEntity with not found error
     */
    @ExceptionHandler(ToDoNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleToDoNotFoundException(ToDoNotFoundException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles ToDo validation exceptions.
     * 
     * @param ex the validation exception
     * @return ResponseEntity with validation error
     */
    @ExceptionHandler(ToDoValidationException.class)
    public ResponseEntity<ApiResponse<Object>> handleToDoValidationException(ToDoValidationException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles general ToDo exceptions.
     * 
     * @param ex the general ToDo exception
     * @return ResponseEntity with error message
     */
    @ExceptionHandler(ToDoException.class)
    public ResponseEntity<ApiResponse<Object>> handleToDoException(ToDoException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles unexpected exceptions.
     * 
     * @param ex the unexpected exception
     * @return ResponseEntity with generic error message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        ApiResponse<Object> response = ApiResponse.error("An unexpected error occurred");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
