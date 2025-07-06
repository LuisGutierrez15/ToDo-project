package com.gupiluan.to_do_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Domain model representing a ToDo item.
 * This entity is prepared for JPA persistence while maintaining in-memory
 * compatibility.
 * 
 * @author gupiluan
 */
@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
public class ToDo {

    /** Maximum allowed length for ToDo text content */
    public static final int MAX_TEXT_LENGTH = 120;

    /**
     * Unique identifier for the ToDo item.
     * Auto-generated when persisted to database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The text content of the ToDo item.
     * Must be non-blank and within character limits.
     */
    @NotBlank(message = "ToDo text cannot be blank")
    @Size(min = 1, max = MAX_TEXT_LENGTH, message = "ToDo text must be between {min} and {max} characters")
    @Column(nullable = false, length = MAX_TEXT_LENGTH)
    private String text;

    /**
     * Optional due date for the ToDo item.
     */
    @Column(name = "due_date")
    private LocalDateTime dueDate;

    /**
     * Flag indicating whether the ToDo item is completed.
     */
    @Column(name = "done_flag", nullable = false)
    private boolean doneFlag = false;

    /**
     * Timestamp when the ToDo was marked as completed.
     * Null if the item is not yet completed.
     */
    @Column(name = "done_date")
    private LocalDateTime doneDate;

    /**
     * Priority level of the ToDo item.
     * Cannot be null - all items must have a priority.
     */
    @NotNull(message = "Priority is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    /**
     * Timestamp when the ToDo item was created.
     * Automatically set when the entity is first persisted.
     */
    @Column(name = "creation_time", nullable = false, updatable = false)
    private LocalDateTime creationTime;

    /**
     * Constructor for creating a new ToDo with basic information.
     * 
     * @param id       the unique identifier
     * @param text     the content text
     * @param dueDate  the optional due date
     * @param priority the priority level
     */
    public ToDo(Long id, String text, LocalDateTime dueDate, Priority priority) {
        this.id = id;
        this.text = text;
        this.dueDate = dueDate;
        this.priority = priority;
        this.creationTime = LocalDateTime.now();
    }

    /**
     * Sets the creation time before persisting the entity.
     * Ensures all ToDo items have a creation timestamp.
     */
    @PrePersist
    protected void onCreate() {
        if (creationTime == null) {
            creationTime = LocalDateTime.now();
        }
    }
}
