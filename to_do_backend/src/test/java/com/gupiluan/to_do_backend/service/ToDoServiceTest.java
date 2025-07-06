package com.gupiluan.to_do_backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.gupiluan.to_do_backend.dto.ToDoCreateRequest;
import com.gupiluan.to_do_backend.dto.ToDoResponse;
import com.gupiluan.to_do_backend.dto.ToDoUpdateRequest;
import com.gupiluan.to_do_backend.exception.ToDoNotFoundException;
import com.gupiluan.to_do_backend.exception.ToDoValidationException;
import com.gupiluan.to_do_backend.model.Pagination;
import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;
import com.gupiluan.to_do_backend.repository.IToDoRepository;

/**
 * Comprehensive unit tests for ToDoService.
 * Tests business logic, validation, and error handling.
 * 
 * @author gupiluan
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ToDo Service Tests")
class ToDoServiceTest {

    @Mock
    private IToDoRepository toDoRepository;

    @InjectMocks
    private ToDoService toDoService;

    private ToDo sampleToDo;
    private ToDoCreateRequest sampleCreateRequest;
    private ToDoUpdateRequest sampleUpdateRequest;

    @BeforeEach
    void setUp() {
        // Setup sample data for tests
        sampleToDo = new ToDo();
        sampleToDo.setId(1L);
        sampleToDo.setText("Test ToDo");
        sampleToDo.setPriority(Priority.MEDIUM);
        sampleToDo.setCreationTime(LocalDateTime.now().minusHours(1));
        sampleToDo.setDoneFlag(false);

        sampleCreateRequest = new ToDoCreateRequest();
        sampleCreateRequest.setText("New ToDo");
        sampleCreateRequest.setPriority(Priority.HIGH);
        sampleCreateRequest.setDueDate(LocalDateTime.now().plusDays(1));

        sampleUpdateRequest = new ToDoUpdateRequest();
        sampleUpdateRequest.setText("Updated ToDo");
        sampleUpdateRequest.setPriority(Priority.LOW);
    }

    @Nested
    @DisplayName("Get ToDo Tests")
    class GetToDoTests {

        @Test
        @DisplayName("Should return ToDo when valid ID is provided")
        void shouldReturnToDoWhenValidId() {
            // Given
            when(toDoRepository.findById(1L)).thenReturn(Optional.of(sampleToDo));

            // When
            ToDoResponse result = toDoService.getToDo(1L);

            // Then
            assertNotNull(result);
            assertEquals(sampleToDo.getId(), result.getId());
            assertEquals(sampleToDo.getText(), result.getText());
            assertEquals(sampleToDo.getPriority(), result.getPriority());
            verify(toDoRepository).findById(1L);
        }

        @Test
        @DisplayName("Should throw ToDoNotFoundException when ToDo does not exist")
        void shouldThrowNotFoundExceptionWhenToDoNotExists() {
            // Given
            when(toDoRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThrows(ToDoNotFoundException.class, () -> toDoService.getToDo(999L));
            verify(toDoRepository).findById(999L);
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when ID is null")
        void shouldThrowValidationExceptionWhenIdIsNull() {
            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.getToDo(null));
            verify(toDoRepository, never()).findById(any());
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when ID is negative")
        void shouldThrowValidationExceptionWhenIdIsNegative() {
            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.getToDo(-1L));
            verify(toDoRepository, never()).findById(any());
        }
    }

    @Nested
    @DisplayName("Create ToDo Tests")
    class CreateToDoTests {

        @Test
        @DisplayName("Should create ToDo successfully with valid request")
        void shouldCreateToDoSuccessfully() {
            // Given
            ToDo savedToDo = new ToDo();
            savedToDo.setId(1L);
            savedToDo.setText(sampleCreateRequest.getText());
            savedToDo.setPriority(sampleCreateRequest.getPriority());
            savedToDo.setCreationTime(LocalDateTime.now());

            when(toDoRepository.save(any(ToDo.class))).thenReturn(savedToDo);

            // When
            ToDoResponse result = toDoService.createToDo(sampleCreateRequest);

            // Then
            assertNotNull(result);
            assertEquals(savedToDo.getId(), result.getId());
            assertEquals(sampleCreateRequest.getText(), result.getText());
            assertEquals(sampleCreateRequest.getPriority(), result.getPriority());
            verify(toDoRepository).save(any(ToDo.class));
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when request is null")
        void shouldThrowValidationExceptionWhenRequestIsNull() {
            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.createToDo(null));
            verify(toDoRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when text is blank")
        void shouldThrowValidationExceptionWhenTextIsBlank() {
            // Given
            sampleCreateRequest.setText("");

            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.createToDo(sampleCreateRequest));
            verify(toDoRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when text exceeds max length")
        void shouldThrowValidationExceptionWhenTextTooLong() {
            // Given
            sampleCreateRequest.setText("a".repeat(121)); // Exceeds 120 character limit

            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.createToDo(sampleCreateRequest));
            verify(toDoRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when priority is null")
        void shouldThrowValidationExceptionWhenPriorityIsNull() {
            // Given
            sampleCreateRequest.setPriority(null);

            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.createToDo(sampleCreateRequest));
            verify(toDoRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Update ToDo Tests")
    class UpdateToDoTests {

        @Test
        @DisplayName("Should update ToDo successfully when valid request")
        void shouldUpdateToDoSuccessfully() {
            // Given
            when(toDoRepository.findById(1L)).thenReturn(Optional.of(sampleToDo));
            when(toDoRepository.update(any(ToDo.class))).thenReturn(true);

            // When
            boolean result = toDoService.updateToDo(1L, sampleUpdateRequest);

            // Then
            assertTrue(result);
            verify(toDoRepository).findById(1L);
            verify(toDoRepository).update(any(ToDo.class));
        }

        @Test
        @DisplayName("Should throw ToDoNotFoundException when ToDo does not exist")
        void shouldThrowNotFoundExceptionWhenUpdatingNonexistentToDo() {
            // Given
            when(toDoRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThrows(ToDoNotFoundException.class, () -> toDoService.updateToDo(999L, sampleUpdateRequest));
            verify(toDoRepository).findById(999L);
            verify(toDoRepository, never()).update(any());
        }
    }

    @Nested
    @DisplayName("Mark Done/Undone Tests")
    class MarkDoneUndoneTests {

        @Test
        @DisplayName("Should mark ToDo as done successfully")
        void shouldMarkToDoAsDone() {
            // Given
            when(toDoRepository.findById(1L)).thenReturn(Optional.of(sampleToDo));
            when(toDoRepository.update(any(ToDo.class))).thenReturn(true);

            // When
            boolean result = toDoService.markDone(1L);

            // Then
            assertTrue(result);
            verify(toDoRepository).findById(1L);
            verify(toDoRepository).update(argThat(todo -> todo.isDoneFlag() && todo.getDoneDate() != null));
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when ToDo already done")
        void shouldThrowValidationExceptionWhenAlreadyDone() {
            // Given
            sampleToDo.setDoneFlag(true);
            sampleToDo.setDoneDate(LocalDateTime.now());
            when(toDoRepository.findById(1L)).thenReturn(Optional.of(sampleToDo));

            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.markDone(1L));
            verify(toDoRepository, never()).update(any());
        }

        @Test
        @DisplayName("Should mark ToDo as undone successfully")
        void shouldMarkToDoAsUndone() {
            // Given
            sampleToDo.setDoneFlag(true);
            sampleToDo.setDoneDate(LocalDateTime.now());
            when(toDoRepository.findById(1L)).thenReturn(Optional.of(sampleToDo));
            when(toDoRepository.update(any(ToDo.class))).thenReturn(true);

            // When
            boolean result = toDoService.markUnDone(1L);

            // Then
            assertTrue(result);
            verify(toDoRepository).findById(1L);
            verify(toDoRepository).update(argThat(todo -> !todo.isDoneFlag() && todo.getDoneDate() == null));
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when ToDo not done")
        void shouldThrowValidationExceptionWhenNotDone() {
            // Given
            when(toDoRepository.findById(1L)).thenReturn(Optional.of(sampleToDo));

            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.markUnDone(1L));
            verify(toDoRepository, never()).update(any());
        }
    }

    @Nested
    @DisplayName("Delete ToDo Tests")
    class DeleteToDoTests {

        @Test
        @DisplayName("Should delete ToDo successfully")
        void shouldDeleteToDoSuccessfully() {
            // Given
            when(toDoRepository.deleteByIdAndReturn(1L)).thenReturn(sampleToDo);

            // When
            ToDoResponse result = toDoService.deleteToDo(1L);

            // Then
            assertNotNull(result);
            assertEquals(sampleToDo.getId(), result.getId());
            verify(toDoRepository).deleteByIdAndReturn(1L);
        }

        @Test
        @DisplayName("Should throw ToDoNotFoundException when ToDo does not exist")
        void shouldThrowNotFoundExceptionWhenDeletingNonexistentToDo() {
            // Given
            when(toDoRepository.deleteByIdAndReturn(999L)).thenReturn(null);

            // When & Then
            assertThrows(ToDoNotFoundException.class, () -> toDoService.deleteToDo(999L));
            verify(toDoRepository).deleteByIdAndReturn(999L);
        }
    }

    @Nested
    @DisplayName("Get All ToDos Tests")
    class GetAllToDosTests {

        @Test
        @DisplayName("Should return paginated ToDos successfully")
        void shouldReturnPaginatedToDosSuccessfully() {
            // Given
            List<ToDo> todos = List.of(sampleToDo);
            Page<ToDo> page = new PageImpl<>(todos, PageRequest.of(0, 10), 1);
            when(toDoRepository.findWithFilters(any(), any(), any(), any(Pageable.class)))
                    .thenReturn(page);

            // When
            Pagination<List<ToDoResponse>> result = toDoService.getAllToDos(0, 10, null, null, null, null, null);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getTotal());
            assertEquals(1, result.getData().size());
            assertEquals(sampleToDo.getText(), result.getData().get(0).getText());
        }

        @Test
        @DisplayName("Should throw ToDoValidationException for invalid pagination params")
        void shouldThrowValidationExceptionForInvalidPagination() {
            // When & Then
            assertThrows(ToDoValidationException.class,
                    () -> toDoService.getAllToDos(-1, 10, null, null, null, null, null));

            assertThrows(ToDoValidationException.class,
                    () -> toDoService.getAllToDos(0, 0, null, null, null, null, null));

            assertThrows(ToDoValidationException.class,
                    () -> toDoService.getAllToDos(0, 101, null, null, null, null, null));
        }
    }

    @Nested
    @DisplayName("Statistics Tests")
    class StatisticsTests {

        @Test
        @DisplayName("Should calculate completion statistics correctly")
        void shouldCalculateCompletionStatisticsCorrectly() {
            // Given
            ToDo completedToDo = new ToDo();
            completedToDo.setId(1L);
            completedToDo.setPriority(Priority.HIGH);
            completedToDo.setDoneFlag(true);
            completedToDo.setCreationTime(LocalDateTime.now().minusHours(2));
            completedToDo.setDoneDate(LocalDateTime.now().minusHours(1));

            when(toDoRepository.findCompletedByPriority(Priority.HIGH)).thenReturn(List.of(completedToDo));
            when(toDoRepository.findCompletedByPriority(Priority.MEDIUM)).thenReturn(List.of());
            when(toDoRepository.findCompletedByPriority(Priority.LOW)).thenReturn(List.of());
            when(toDoRepository.getDurationBetween(any(), any())).thenReturn(java.time.Duration.ofMinutes(60));

            // When
            Map<Priority, Integer> result = toDoService.getCompletionStatistics();

            // Then
            assertNotNull(result);
            assertEquals(60, result.get(Priority.HIGH));
            assertEquals(0, result.get(Priority.MEDIUM));
            assertEquals(0, result.get(Priority.LOW));
        }
    }

    @Nested
    @DisplayName("Batch Create Tests")
    class BatchCreateTests {

        @Test
        @DisplayName("Should create multiple ToDos successfully")
        void shouldCreateMultipleToDosSuccessfully() {
            // Given
            List<ToDoCreateRequest> requests = List.of(sampleCreateRequest, sampleCreateRequest);
            when(toDoRepository.save(any(ToDo.class))).thenReturn(sampleToDo);

            // When
            Map<String, Integer> result = toDoService.createToDos(requests);

            // Then
            assertEquals(2, result.get("successful"));
            assertEquals(0, result.get("failed"));
            verify(toDoRepository, times(2)).save(any(ToDo.class));
        }

        @Test
        @DisplayName("Should handle validation errors in batch create")
        void shouldHandleValidationErrorsInBatchCreate() {
            // Given
            ToDoCreateRequest invalidRequest = new ToDoCreateRequest();
            invalidRequest.setText(""); // Invalid
            List<ToDoCreateRequest> requests = List.of(sampleCreateRequest, invalidRequest);
            when(toDoRepository.save(any(ToDo.class))).thenReturn(sampleToDo);

            // When
            Map<String, Integer> result = toDoService.createToDos(requests);

            // Then
            assertEquals(1, result.get("successful"));
            assertEquals(1, result.get("failed"));
            verify(toDoRepository, times(1)).save(any(ToDo.class));
        }

        @Test
        @DisplayName("Should throw ToDoValidationException when request list is empty")
        void shouldThrowValidationExceptionWhenRequestListEmpty() {
            // When & Then
            assertThrows(ToDoValidationException.class, () -> toDoService.createToDos(List.of()));
            assertThrows(ToDoValidationException.class, () -> toDoService.createToDos(null));
        }
    }
}
