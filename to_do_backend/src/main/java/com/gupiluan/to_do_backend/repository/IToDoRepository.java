package com.gupiluan.to_do_backend.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;

/**
 * Repository interface for ToDo entities.
 * Defines contract for data access operations on ToDo items.
 * Compatible with both in-memory and JPA implementations.
 * 
 * @author gupiluan
 */
public interface IToDoRepository {

    /**
     * Retrieves all ToDo items.
     * 
     * @return List of all ToDo items
     */
    List<ToDo> findAll();

    /**
     * Retrieves a ToDo item by its ID.
     * 
     * @param id the ID of the ToDo item
     * @return Optional containing the ToDo if found, empty otherwise
     */
    Optional<ToDo> findById(Long id);

    /**
     * Saves a new ToDo item or updates an existing one.
     * 
     * @param toDo the ToDo item to save
     * @return the saved ToDo item with generated ID if new
     */
    ToDo save(ToDo toDo);

    /**
     * Updates an existing ToDo item.
     * 
     * @param toDo the ToDo item to update
     * @return true if update was successful, false if ToDo not found
     */
    boolean update(ToDo toDo);

    /**
     * Deletes a ToDo item by ID and returns the deleted item.
     * 
     * @param id the ID of the ToDo to delete
     * @return the deleted ToDo item, null if not found
     */
    ToDo deleteByIdAndReturn(Long id);

    /**
     * Deletes all ToDo items.
     * Used primarily for testing purposes.
     */
    void deleteAll();

    /**
     * Finds all ToDo items matching the specified criteria with pagination.
     * 
     * @param text     optional text filter (case-insensitive partial match)
     * @param doneFlag optional completion status filter
     * @param priority optional priority filter
     * @param pageable pagination and sorting parameters
     * @return Page of filtered ToDo items
     */
    Page<ToDo> findWithFilters(String text, Boolean doneFlag, Priority priority, Pageable pageable);

    /**
     * Finds all completed ToDo items with specified priority for statistics.
     * 
     * @param priority the priority level to filter by
     * @return List of completed ToDo items with the specified priority
     */
    List<ToDo> findCompletedByPriority(Priority priority);

    /**
     * Calculates the duration between two timestamps.
     * Utility method for completion time analysis.
     * 
     * @param start the start timestamp
     * @param end   the end timestamp
     * @return Duration between the timestamps
     */
    Duration getDurationBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Finds ToDo items by completion status.
     * 
     * @param doneFlag the completion status
     * @return List of ToDo items with the specified completion status
     */
    List<ToDo> findByDoneFlag(boolean doneFlag);

    /**
     * Finds ToDo items by priority level.
     * 
     * @param priority the priority level
     * @return List of ToDo items with the specified priority
     */
    List<ToDo> findByPriority(Priority priority);

    /**
     * Finds ToDo items with due dates before the specified date.
     * 
     * @param date the cutoff date
     * @return List of overdue ToDo items
     */
    List<ToDo> findByDueDateBeforeAndDoneFlagFalse(LocalDateTime date);
}
