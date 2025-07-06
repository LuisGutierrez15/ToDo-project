package com.gupiluan.to_do_backend.exception;

/**
 * Exception thrown when a ToDo operation violates business rules.
 * 
 * @author gupiluan
 */
public class ToDoValidationException extends ToDoException {

    /**
     * Constructs a new ToDoValidationException with the specified validation
     * message.
     * 
     * @param message the validation error message
     */
    public ToDoValidationException(String message) {
        super("Validation error: " + message);
    }
}
