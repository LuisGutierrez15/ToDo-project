package com.gupiluan.to_do_backend.exception;

/**
 * Custom exception for ToDo-related business logic errors.
 * Provides specific error handling for ToDo operations.
 * 
 * @author gupiluan
 */
public class ToDoException extends RuntimeException {

    /**
     * Constructs a new ToDoException with the specified detail message.
     * 
     * @param message the detail message
     */
    public ToDoException(String message) {
        super(message);
    }

    /**
     * Constructs a new ToDoException with the specified detail message and cause.
     * 
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public ToDoException(String message, Throwable cause) {
        super(message, cause);
    }
}
