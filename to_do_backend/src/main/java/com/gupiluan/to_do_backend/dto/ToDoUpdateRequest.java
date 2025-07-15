package com.gupiluan.to_do_backend.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import com.gupiluan.to_do_backend.model.Priority;

/**
 * Data Transfer Object for updating an existing ToDo item.
 * Provides validation for update operations while maintaining API contract
 * separation.
 * 
 * @author gupiluan
 */
@Data
public class ToDoUpdateRequest {

    /**
     * Updated text content of the ToDo item.
     * Must be between 1 and 120 characters.
     */
    @NotBlank(message = "ToDo text cannot be blank")
    @Size(min = 1, max = 120, message = "ToDo text must be between {min} and {max} characters")
    private String text;

    /**
     * Updated due date for the ToDo item.
     * Can be null to remove deadline.
     */
    private LocalDateTime dueDate;

    /**
     * Updated priority level of the ToDo item.
     * Cannot be null - all items must have a priority.
     */
    @NotNull(message = "Priority is required")
    private Priority priority;
}
