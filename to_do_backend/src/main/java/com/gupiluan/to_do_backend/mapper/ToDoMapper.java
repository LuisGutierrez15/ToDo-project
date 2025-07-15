package com.gupiluan.to_do_backend.mapper;

import com.gupiluan.to_do_backend.dto.ToDoCreateRequest;
import com.gupiluan.to_do_backend.dto.ToDoResponse;
import com.gupiluan.to_do_backend.dto.ToDoUpdateRequest;
import com.gupiluan.to_do_backend.model.ToDo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for mapping between DTOs and domain models.
 * Provides clean separation between API contracts and internal domain models.
 * 
 * @author gupiluan
 */
public final class ToDoMapper {

    // Private constructor to prevent instantiation
    private ToDoMapper() {
        throw new UnsupportedOperationException("Utility class should not be instantiated");
    }

    /**
     * Converts a ToDoCreateRequest DTO to a ToDo domain model.
     * 
     * @param request the creation request DTO
     * @return new ToDo entity ready for persistence
     */
    public static ToDo toEntity(ToDoCreateRequest request) {
        if (request == null) {
            return null;
        }

        ToDo toDo = new ToDo();
        toDo.setText(request.getText());
        toDo.setDueDate(request.getDueDate());
        toDo.setPriority(request.getPriority());
        toDo.setCreationTime(LocalDateTime.now());

        return toDo;
    }

    /**
     * Converts a ToDoUpdateRequest DTO to a ToDo domain model.
     * 
     * @param request    the update request DTO
     * @param existingId the ID of the existing ToDo to update
     * @return updated ToDo entity
     */
    public static ToDo toEntity(ToDoUpdateRequest request, Long existingId) {
        if (request == null) {
            return null;
        }

        ToDo toDo = new ToDo();
        toDo.setId(existingId);
        toDo.setText(request.getText());
        toDo.setDueDate(request.getDueDate());
        toDo.setPriority(request.getPriority());

        return toDo;
    }

    /**
     * Converts a ToDo domain model to a ToDoResponse DTO.
     * 
     * @param toDo the domain model
     * @return response DTO for API consumers
     */
    public static ToDoResponse toResponse(ToDo toDo) {
        if (toDo == null) {
            return null;
        }

        return new ToDoResponse(
                toDo.getId(),
                toDo.getText(),
                toDo.getDueDate(),
                toDo.isDoneFlag(),
                toDo.getDoneDate(),
                toDo.getPriority(),
                toDo.getCreationTime());
    }

    /**
     * Converts a list of ToDo domain models to ToDoResponse DTOs.
     * 
     * @param toDos list of domain models
     * @return list of response DTOs
     */
    public static List<ToDoResponse> toResponseList(List<ToDo> toDos) {
        if (toDos == null) {
            return null;
        }

        return toDos.stream()
                .map(ToDoMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing ToDo entity with data from an update request.
     * Preserves fields that shouldn't be modified during updates.
     * 
     * @param existing      the existing ToDo entity
     * @param updateRequest the update request DTO
     */
    public static void updateEntity(ToDo existing, ToDoUpdateRequest updateRequest) {
        if (existing == null || updateRequest == null) {
            return;
        }

        existing.setText(updateRequest.getText());
        existing.setDueDate(updateRequest.getDueDate());
        existing.setPriority(updateRequest.getPriority());
        // Note: ID, creationTime, doneFlag, and doneDate are preserved
    }
}
