package com.gupiluan.to_do_backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.gupiluan.to_do_backend.model.Priority;

/**
 * Data Transfer Object for ToDo responses.
 * Ensures consistent API responses and hides internal model details.
 * 
 * @author gupiluan
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToDoResponse {

    /**
     * Unique identifier of the ToDo item.
     */
    private Long id;

    /**
     * Text content of the ToDo item.
     */
    private String text;

    /**
     * Due date of the ToDo item, can be null.
     */
    private LocalDateTime dueDate;

    /**
     * Completion status of the ToDo item.
     */
    private boolean doneFlag;

    /**
     * Date when the ToDo was marked as done, null if not completed.
     */
    private LocalDateTime doneDate;

    /**
     * Priority level of the ToDo item.
     */
    private Priority priority;

    /**
     * Timestamp when the ToDo was created.
     */
    private LocalDateTime creationTime;
}
