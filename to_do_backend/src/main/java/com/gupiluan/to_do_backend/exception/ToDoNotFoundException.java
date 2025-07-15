package com.gupiluan.to_do_backend.exception;

/**
 * Exception thrown when a requested ToDo item is not found.
 * 
 * @author gupiluan
 */
public class ToDoNotFoundException extends ToDoException {

    /**
     * Constructs a new ToDoNotFoundException for the specified ID.
     * 
     * @param id the ID of the ToDo that was not found
     */
    public ToDoNotFoundException(Long id) {
        super("ToDo with ID " + id + " not found");
    }
}
