package com.gupiluan.to_do_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gupiluan.to_do_backend.dto.ToDoCreateRequest;
import com.gupiluan.to_do_backend.dto.ToDoResponse;
import com.gupiluan.to_do_backend.dto.ToDoUpdateRequest;
import com.gupiluan.to_do_backend.model.ApiResponse;
import com.gupiluan.to_do_backend.model.Pagination;
import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.service.ToDoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * REST controller for ToDo management operations.
 * Provides endpoints for CRUD operations, filtering, pagination, and
 * statistics.
 * 
 * @author gupiluan
 */
@RestController
@RequestMapping("/todos")
@Tag(name = "ToDo Management", description = "Operations for managing ToDo items")
public class ToDoController {

    private final ToDoService toDoService;

    /**
     * Constructor with dependency injection.
     * 
     * @param toDoService the service layer for ToDo operations
     */
    @Autowired
    public ToDoController(ToDoService toDoService) {
        this.toDoService = toDoService;
    }

    /**
     * Retrieves all ToDo items with optional filtering, sorting, and pagination.
     * 
     * @param page           page number (0-based, default: 0)
     * @param size           items per page (default: 10, max: 100)
     * @param complete       completion status filter ("done" or "pending")
     * @param name           text content filter (case-insensitive partial match)
     * @param priority       priority level filter
     * @param sortByPriority sort direction for priority ("asc" or "desc")
     * @param sortByDueDate  sort direction for due date ("asc" or "desc")
     * @return Paginated list of ToDo items matching the criteria
     */
    @GetMapping
    @Operation(summary = "Get all ToDo items", description = "Retrieve ToDo items with filtering, sorting, and pagination")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved ToDo items"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    public ResponseEntity<Pagination<List<ToDoResponse>>> getAllTodos(
            @Parameter(description = "Page number (0-based)") @RequestParam(required = false, defaultValue = "0") int page,
            @Parameter(description = "Items per page") @RequestParam(required = false, defaultValue = "10") int size,
            @Parameter(description = "Completion status filter") @RequestParam(required = false) String complete,
            @Parameter(description = "Text content filter") @RequestParam(required = false) String name,
            @Parameter(description = "Priority level filter") @RequestParam(required = false) Priority priority,
            @Parameter(description = "Sort direction for priority") @RequestParam(required = false) String sortByPriority,
            @Parameter(description = "Sort direction for due date") @RequestParam(required = false) String sortByDueDate) {

        Pagination<List<ToDoResponse>> pagination = toDoService.getAllToDos(
                page, size, name, complete, priority, sortByDueDate, sortByPriority);

        return new ResponseEntity<>(pagination, HttpStatus.OK);
    }

    /**
     * Retrieves a specific ToDo item by ID.
     * 
     * @param id the unique identifier of the ToDo item
     * @return ApiResponse containing the ToDo item data
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get ToDo by ID", description = "Retrieve a specific ToDo item by its unique identifier")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "ToDo item found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "ToDo item not found")
    })
    public ResponseEntity<ApiResponse<ToDoResponse>> getToDo(
            @Parameter(description = "ToDo item ID") @PathVariable Long id) {

        ToDoResponse toDo = toDoService.getToDo(id);
        ApiResponse<ToDoResponse> response = ApiResponse.success("ToDo retrieved successfully", toDo);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Creates a new ToDo item.
     * 
     * @param request the creation request containing ToDo data
     * @return ApiResponse containing the created ToDo with generated ID
     */
    @PostMapping
    @Operation(summary = "Create new ToDo", description = "Create a new ToDo item")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "ToDo created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<ApiResponse<ToDoResponse>> createToDo(
            @Parameter(description = "ToDo creation data") @RequestBody @Valid ToDoCreateRequest request) {

        ToDoResponse created = toDoService.createToDo(request);
        ApiResponse<ToDoResponse> response = ApiResponse.success("ToDo created successfully", created);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Creates multiple ToDo items in batch.
     * 
     * @param requests list of creation requests
     * @return ApiResponse containing creation statistics
     */
    @PostMapping("/batch")
    @Operation(summary = "Create multiple ToDos", description = "Create multiple ToDo items in a single request")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Batch creation completed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<ApiResponse<Map<String, Integer>>> createToDos(
            @Parameter(description = "List of ToDo creation requests") @RequestBody @Valid List<ToDoCreateRequest> requests) {

        Map<String, Integer> result = toDoService.createToDos(requests);
        String message = result.get("failed") == 0 ? "All ToDos created successfully"
                : String.format("Created %d ToDos, %d failed", result.get("successful"), result.get("failed"));

        ApiResponse<Map<String, Integer>> response = ApiResponse.success(message, result);
        HttpStatus status = result.get("failed") == 0 ? HttpStatus.CREATED : HttpStatus.PARTIAL_CONTENT;

        return new ResponseEntity<>(response, status);
    }

    /**
     * Updates an existing ToDo item.
     * 
     * @param id      the ID of the ToDo to update
     * @param request the update request containing new data
     * @return ApiResponse indicating success or failure
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update ToDo", description = "Update an existing ToDo item")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "ToDo updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "ToDo not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<ApiResponse<Boolean>> updateToDo(
            @Parameter(description = "ToDo item ID") @PathVariable Long id,
            @Parameter(description = "ToDo update data") @RequestBody @Valid ToDoUpdateRequest request) {

        boolean updated = toDoService.updateToDo(id, request);
        ApiResponse<Boolean> response = ApiResponse.success("ToDo updated successfully", updated);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Marks a ToDo item as completed.
     * 
     * @param id the ID of the ToDo to mark as done
     * @return ApiResponse indicating success or failure
     */
    @PostMapping("/{id}/done")
    @Operation(summary = "Mark ToDo as done", description = "Mark a ToDo item as completed")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "ToDo marked as done"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "ToDo not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "ToDo already completed")
    })
    public ResponseEntity<ApiResponse<Boolean>> markDone(
            @Parameter(description = "ToDo item ID") @PathVariable Long id) {

        boolean updated = toDoService.markDone(id);
        ApiResponse<Boolean> response = ApiResponse.success("ToDo marked as done", updated);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Marks a ToDo item as not completed.
     * 
     * @param id the ID of the ToDo to mark as undone
     * @return ApiResponse indicating success or failure
     */
    @PutMapping("/{id}/undone")
    @Operation(summary = "Mark ToDo as undone", description = "Mark a ToDo item as not completed")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "ToDo marked as undone"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "ToDo not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "ToDo not completed")
    })
    public ResponseEntity<ApiResponse<Boolean>> markUnDone(
            @Parameter(description = "ToDo item ID") @PathVariable Long id) {

        boolean updated = toDoService.markUnDone(id);
        ApiResponse<Boolean> response = ApiResponse.success("ToDo marked as undone", updated);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Deletes a ToDo item.
     * 
     * @param id the ID of the ToDo to delete
     * @return ApiResponse containing the deleted ToDo data
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete ToDo", description = "Delete a ToDo item by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "ToDo deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "ToDo not found")
    })
    public ResponseEntity<ApiResponse<ToDoResponse>> deleteToDo(
            @Parameter(description = "ToDo item ID") @PathVariable Long id) {

        ToDoResponse deleted = toDoService.deleteToDo(id);
        ApiResponse<ToDoResponse> response = ApiResponse.success("ToDo deleted successfully", deleted);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Retrieves completion time statistics by priority.
     * 
     * @return ApiResponse containing average completion times for each priority
     *         level
     */
    @GetMapping("/stats")
    @Operation(summary = "Get completion statistics", description = "Get average completion time statistics by priority level")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Map<Priority, Integer>>> getStatistics() {
        Map<Priority, Integer> stats = toDoService.getCompletionStatistics();
        ApiResponse<Map<Priority, Integer>> response = ApiResponse.success("Statistics retrieved successfully", stats);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Retrieves overdue ToDo items.
     * 
     * @return ApiResponse containing list of overdue ToDo items
     */
    @GetMapping("/overdue")
    @Operation(summary = "Get overdue ToDos", description = "Retrieve all overdue ToDo items")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Overdue ToDos retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<ToDoResponse>>> getOverdueTodos() {
        List<ToDoResponse> overdue = toDoService.getOverdueTodos();
        String message = overdue.isEmpty() ? "No overdue ToDos found" : "Overdue ToDos retrieved successfully";
        ApiResponse<List<ToDoResponse>> response = ApiResponse.success(message, overdue);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
