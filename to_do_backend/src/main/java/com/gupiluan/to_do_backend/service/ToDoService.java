package com.gupiluan.to_do_backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gupiluan.to_do_backend.dto.ToDoCreateRequest;
import com.gupiluan.to_do_backend.dto.ToDoResponse;
import com.gupiluan.to_do_backend.dto.ToDoUpdateRequest;
import com.gupiluan.to_do_backend.exception.ToDoException;
import com.gupiluan.to_do_backend.exception.ToDoNotFoundException;
import com.gupiluan.to_do_backend.exception.ToDoValidationException;
import com.gupiluan.to_do_backend.mapper.ToDoMapper;
import com.gupiluan.to_do_backend.model.Pagination;
import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;
import com.gupiluan.to_do_backend.repository.IToDoRepository;

/**
 * Service layer for ToDo business logic.
 * Handles validation, business rules, and coordination between controller and
 * repository layers.
 * 
 * @author gupiluan
 */
@Service
@Transactional
public class ToDoService {

    private final IToDoRepository toDoRepository;

    /**
     * Constructor with dependency injection.
     * 
     * @param toDoRepository the repository for data access
     */
    @Autowired
    public ToDoService(IToDoRepository toDoRepository) {
        this.toDoRepository = toDoRepository;
    }

    /**
     * Retrieves a ToDo item by its ID.
     * 
     * @param id the ID of the ToDo item
     * @return ToDoResponse containing the ToDo data
     * @throws ToDoException if ToDo is not found
     */
    @Transactional(readOnly = true)
    public ToDoResponse getToDo(Long id) {
        validateId(id);

        ToDo toDo = toDoRepository.findById(id)
                .orElseThrow(() -> new ToDoNotFoundException(id));

        return ToDoMapper.toResponse(toDo);
    }

    /**
     * Creates a new ToDo item.
     * 
     * @param request the creation request containing ToDo data
     * @return ToDoResponse containing the created ToDo with generated ID
     * @throws ToDoException if validation fails
     */
    public ToDoResponse createToDo(ToDoCreateRequest request) {
        validateCreateRequest(request);

        ToDo toDo = ToDoMapper.toEntity(request);
        ToDo saved = toDoRepository.save(toDo);

        return ToDoMapper.toResponse(saved);
    }

    /**
     * Creates multiple ToDo items in batch.
     * 
     * @param requests list of creation requests
     * @return Map containing creation results with counts of successful and failed
     *         operations
     */
    public Map<String, Integer> createToDos(List<ToDoCreateRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new ToDoValidationException("Request list cannot be empty");
        }

        int successful = 0;
        int failed = 0;

        for (ToDoCreateRequest request : requests) {
            try {
                validateCreateRequest(request);
                ToDo toDo = ToDoMapper.toEntity(request);
                toDoRepository.save(toDo);
                successful++;
            } catch (Exception e) {
                failed++;
            }
        }

        Map<String, Integer> result = new HashMap<>();
        result.put("successful", successful);
        result.put("failed", failed);

        return result;
    }

    /**
     * Retrieves all ToDo items with filtering, sorting, and pagination.
     * 
     * @param page           page number (0-based)
     * @param size           number of items per page
     * @param name           optional text filter for ToDo content
     * @param complete       optional completion status filter ("done" or "pending")
     * @param priority       optional priority filter
     * @param sortByDueDate  optional sort direction for due date ("asc" or "desc")
     * @param sortByPriority optional sort direction for priority ("asc" or "desc")
     * @return Pagination wrapper containing filtered and sorted ToDo items
     */
    @Transactional(readOnly = true)
    public Pagination<List<ToDoResponse>> getAllToDos(int page, int size, String name,
            String complete, Priority priority, String sortByDueDate, String sortByPriority) {

        validatePaginationParams(page, size);

        Sort sort = buildSortSpecification(sortByDueDate, sortByPriority);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Convert completion filter
        Boolean doneFlag = parseCompletionFilter(complete);

        // Apply filters and get paginated results
        Page<ToDo> todoPage = toDoRepository.findWithFilters(name, doneFlag, priority, pageable);

        // Convert to response DTOs
        List<ToDoResponse> responses = ToDoMapper.toResponseList(todoPage.getContent());

        return Pagination.of(responses, page, size, (int) todoPage.getTotalElements());
    }

    /**
     * Deletes a ToDo item by ID.
     * 
     * @param id the ID of the ToDo to delete
     * @return ToDoResponse containing the deleted ToDo data
     * @throws ToDoException if ToDo is not found
     */
    public ToDoResponse deleteToDo(Long id) {
        validateId(id);

        ToDo deleted = toDoRepository.deleteByIdAndReturn(id);
        if (deleted == null) {
            throw new ToDoNotFoundException(id);
        }

        return ToDoMapper.toResponse(deleted);
    }

    /**
     * Calculates average completion time statistics by priority.
     * 
     * @return Map of priority levels to average completion time in minutes
     */
    @Transactional(readOnly = true)
    public Map<Priority, Integer> getCompletionStatistics() {
        Map<Priority, Integer> statistics = new HashMap<>();

        for (Priority priority : Priority.values()) {
            List<ToDo> completedTodos = toDoRepository.findCompletedByPriority(priority);

            if (completedTodos.isEmpty()) {
                statistics.put(priority, 0);
                continue;
            }

            long totalMinutes = completedTodos.stream()
                    .filter(todo -> todo.getCreationTime() != null && todo.getDoneDate() != null)
                    .mapToLong(todo -> toDoRepository.getDurationBetween(
                            todo.getCreationTime(), todo.getDoneDate()).toMinutes())
                    .sum();

            int averageMinutes = (int) (totalMinutes / completedTodos.size());
            statistics.put(priority, averageMinutes);
        }

        return statistics;
    }

    /**
     * Marks a ToDo item as completed.
     * 
     * @param id the ID of the ToDo to mark as done
     * @return true if successful
     * @throws ToDoException if ToDo is not found or already completed
     */
    public boolean markDone(Long id) {
        validateId(id);

        ToDo toDo = toDoRepository.findById(id)
                .orElseThrow(() -> new ToDoNotFoundException(id));

        if (toDo.isDoneFlag()) {
            throw new ToDoValidationException("ToDo is already marked as done");
        }

        toDo.setDoneFlag(true);
        toDo.setDoneDate(LocalDateTime.now());

        return toDoRepository.update(toDo);
    }

    /**
     * Marks a ToDo item as not completed.
     * 
     * @param id the ID of the ToDo to mark as undone
     * @return true if successful
     * @throws ToDoException if ToDo is not found or not completed
     */
    public boolean markUnDone(Long id) {
        validateId(id);

        ToDo toDo = toDoRepository.findById(id)
                .orElseThrow(() -> new ToDoNotFoundException(id));

        if (!toDo.isDoneFlag()) {
            throw new ToDoValidationException("ToDo is not marked as done");
        }

        toDo.setDoneFlag(false);
        toDo.setDoneDate(null);

        return toDoRepository.update(toDo);
    }

    /**
     * Updates an existing ToDo item.
     * 
     * @param id      the ID of the ToDo to update
     * @param request the update request containing new data
     * @return true if successful
     * @throws ToDoException if ToDo is not found or validation fails
     */
    public boolean updateToDo(Long id, ToDoUpdateRequest request) {
        validateId(id);
        validateUpdateRequest(request);

        ToDo existing = toDoRepository.findById(id)
                .orElseThrow(() -> new ToDoNotFoundException(id));

        // Update fields while preserving system-managed data
        ToDoMapper.updateEntity(existing, request);

        return toDoRepository.update(existing);
    }

    /**
     * Retrieves overdue ToDo items.
     * 
     * @return List of overdue ToDo items
     */
    @Transactional(readOnly = true)
    public List<ToDoResponse> getOverdueTodos() {
        LocalDateTime now = LocalDateTime.now();
        List<ToDo> overdueTodos = toDoRepository.findByDueDateBeforeAndDoneFlagFalse(now);
        return ToDoMapper.toResponseList(overdueTodos);
    }

    // Private validation methods

    /**
     * Validates ID parameter.
     */
    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new ToDoValidationException("ID must be a positive number");
        }
    }

    /**
     * Validates ToDo creation request.
     */
    private void validateCreateRequest(ToDoCreateRequest request) {
        if (request == null) {
            throw new ToDoValidationException("Create request cannot be null");
        }

        if (StringUtils.isBlank(request.getText())) {
            throw new ToDoValidationException("ToDo text cannot be blank");
        }

        if (request.getText().length() > ToDo.MAX_TEXT_LENGTH) {
            throw new ToDoValidationException(
                    "ToDo text cannot exceed " + ToDo.MAX_TEXT_LENGTH + " characters");
        }

        if (request.getPriority() == null) {
            throw new ToDoValidationException("Priority is required");
        }
    }

    /**
     * Validates ToDo update request.
     */
    private void validateUpdateRequest(ToDoUpdateRequest request) {
        if (request == null) {
            throw new ToDoValidationException("Update request cannot be null");
        }

        if (StringUtils.isBlank(request.getText())) {
            throw new ToDoValidationException("ToDo text cannot be blank");
        }

        if (request.getText().length() > ToDo.MAX_TEXT_LENGTH) {
            throw new ToDoValidationException(
                    "ToDo text cannot exceed " + ToDo.MAX_TEXT_LENGTH + " characters");
        }

        if (request.getPriority() == null) {
            throw new ToDoValidationException("Priority is required");
        }
    }

    /**
     * Validates pagination parameters.
     */
    private void validatePaginationParams(int page, int size) {
        if (page < 0) {
            throw new ToDoValidationException("Page number cannot be negative");
        }

        if (size <= 0 || size > 100) {
            throw new ToDoValidationException("Page size must be between 1 and 100");
        }
    }

    /**
     * Builds sort specification from sort parameters.
     */
    private Sort buildSortSpecification(String sortByDueDate, String sortByPriority) {
        Sort sort = Sort.unsorted();
        if (StringUtils.isNotBlank(sortByDueDate)) {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortByDueDate) ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            sort = Sort.by(direction, "dueDate");
        }

        if (StringUtils.isNotBlank(sortByPriority)) {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortByPriority) ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            Sort prioritySort = Sort.by(direction, "priority");
            sort = sort.and(prioritySort);
        }
        sort = sort.and(Sort.by("id")); // Default sort by ID
        return sort;
    }

    /**
     * Parses completion filter string to boolean.
     */
    private Boolean parseCompletionFilter(String complete) {
        if (StringUtils.isBlank(complete)) {
            return null;
        }

        return "done".equalsIgnoreCase(complete);
    }
}
