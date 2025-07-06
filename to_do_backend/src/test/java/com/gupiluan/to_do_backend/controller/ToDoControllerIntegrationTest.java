package com.gupiluan.to_do_backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gupiluan.to_do_backend.dto.ToDoCreateRequest;
import com.gupiluan.to_do_backend.dto.ToDoUpdateRequest;
import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.repository.IToDoRepository;

/**
 * Integration tests for ToDo Controller.
 * Tests the full request-response cycle including validation, security, and
 * error handling.
 * 
 * @author gupiluan
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("ToDo Controller Integration Tests")
class ToDoControllerIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IToDoRepository toDoRepository;

    private ToDoCreateRequest validCreateRequest;
    private ToDoUpdateRequest validUpdateRequest;

    @BeforeEach
    void setUp() {
        // Initialize MockMvc
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        // Clear repository before each test
        // Note: In a real database scenario, this would be handled by @Transactional
        // rollback
        toDoRepository.deleteAll();

        validCreateRequest = new ToDoCreateRequest();
        validCreateRequest.setText("Integration test ToDo");
        validCreateRequest.setPriority(Priority.MEDIUM);
        validCreateRequest.setDueDate(LocalDateTime.now().plusDays(1));

        validUpdateRequest = new ToDoUpdateRequest();
        validUpdateRequest.setText("Updated integration test ToDo");
        validUpdateRequest.setPriority(Priority.HIGH);
    }

    @Nested
    @DisplayName("Create ToDo Endpoint Tests")
    class CreateToDoTests {

        @Test
        @DisplayName("Should create ToDo successfully with valid request")
        void shouldCreateToDoSuccessfully() throws Exception {
            mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.message").value("ToDo created successfully"))
                    .andExpect(jsonPath("$.data.text").value(validCreateRequest.getText()))
                    .andExpect(jsonPath("$.data.priority").value(validCreateRequest.getPriority().toString()))
                    .andExpect(jsonPath("$.data.id").exists())
                    .andExpect(jsonPath("$.data.doneFlag").value(false));
        }

        @Test
        @DisplayName("Should return validation error for blank text")
        void shouldReturnValidationErrorForBlankText() throws Exception {
            validCreateRequest.setText("");

            mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Validation failed"))
                    .andExpect(jsonPath("$.data.text").exists());
        }

        @Test
        @DisplayName("Should return validation error for text exceeding max length")
        void shouldReturnValidationErrorForTextTooLong() throws Exception {
            validCreateRequest.setText("a".repeat(121)); // Exceeds 120 character limit

            mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Validation failed"))
                    .andExpect(jsonPath("$.data.text").exists());
        }

        @Test
        @DisplayName("Should return validation error for null priority")
        void shouldReturnValidationErrorForNullPriority() throws Exception {
            validCreateRequest.setPriority(null);

            mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Validation failed"))
                    .andExpect(jsonPath("$.data.priority").exists());
        }
    }

    @Nested
    @DisplayName("Get ToDo Endpoint Tests")
    class GetToDoTests {

        @Test
        @DisplayName("Should retrieve ToDo by ID successfully")
        void shouldRetrieveToDoById() throws Exception {
            // First create a ToDo
            String createResponse = mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isCreated())
                    .andReturn().getResponse().getContentAsString();

            // Extract ID from response
            Long id = extractIdFromResponse(createResponse);

            // Then retrieve it
            mockMvc.perform(get("/todos/" + id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("ToDo retrieved successfully"))
                    .andExpect(jsonPath("$.data.id").value(id))
                    .andExpect(jsonPath("$.data.text").value(validCreateRequest.getText()));
        }

        @Test
        @DisplayName("Should return 404 for non-existent ToDo ID")
        void shouldReturn404ForNonexistentToDo() throws Exception {
            mockMvc.perform(get("/todos/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("ToDo with ID 999 not found"));
        }

        @Test
        @DisplayName("Should return validation error for invalid ID")
        void shouldReturnValidationErrorForInvalidId() throws Exception {
            mockMvc.perform(get("/todos/-1"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Validation error: ID must be a positive number"));
        }
    }

    @Nested
    @DisplayName("Update ToDo Endpoint Tests")
    class UpdateToDoTests {

        @Test
        @DisplayName("Should update ToDo successfully")
        void shouldUpdateToDoSuccessfully() throws Exception {
            // First create a ToDo
            String createResponse = mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isCreated())
                    .andReturn().getResponse().getContentAsString();

            Long id = extractIdFromResponse(createResponse);

            // Then update it
            mockMvc.perform(put("/todos/" + id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUpdateRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("ToDo updated successfully"))
                    .andExpect(jsonPath("$.data").value(true));

            // Verify the update
            mockMvc.perform(get("/todos/" + id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.text").value(validUpdateRequest.getText()))
                    .andExpect(jsonPath("$.data.priority").value(validUpdateRequest.getPriority().toString()));
        }

        @Test
        @DisplayName("Should return 404 when updating non-existent ToDo")
        void shouldReturn404WhenUpdatingNonexistentToDo() throws Exception {
            mockMvc.perform(put("/todos/999")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUpdateRequest)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("ToDo with ID 999 not found"));
        }
    }

    @Nested
    @DisplayName("Mark Done/Undone Endpoint Tests")
    class MarkDoneUndoneTests {

        @Test
        @DisplayName("Should mark ToDo as done successfully")
        void shouldMarkToDoAsDone() throws Exception {
            // Create a ToDo
            String createResponse = mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isCreated())
                    .andReturn().getResponse().getContentAsString();

            Long id = extractIdFromResponse(createResponse);

            // Mark as done
            mockMvc.perform(post("/todos/" + id + "/done"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("ToDo marked as done"))
                    .andExpect(jsonPath("$.data").value(true));

            // Verify it's marked as done
            mockMvc.perform(get("/todos/" + id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.doneFlag").value(true))
                    .andExpect(jsonPath("$.data.doneDate").exists());
        }

        @Test
        @DisplayName("Should mark ToDo as undone successfully")
        void shouldMarkToDoAsUndone() throws Exception {
            // Create and mark a ToDo as done first
            String createResponse = mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isCreated())
                    .andReturn().getResponse().getContentAsString();

            Long id = extractIdFromResponse(createResponse);

            mockMvc.perform(post("/todos/" + id + "/done"))
                    .andExpect(status().isOk());

            // Mark as undone
            mockMvc.perform(put("/todos/" + id + "/undone"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("ToDo marked as undone"))
                    .andExpect(jsonPath("$.data").value(true));

            // Verify it's marked as undone
            mockMvc.perform(get("/todos/" + id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.doneFlag").value(false))
                    .andExpect(jsonPath("$.data.doneDate").isEmpty());
        }
    }

    @Nested
    @DisplayName("Delete ToDo Endpoint Tests")
    class DeleteToDoTests {

        @Test
        @DisplayName("Should delete ToDo successfully")
        void shouldDeleteToDoSuccessfully() throws Exception {
            // Create a ToDo
            String createResponse = mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validCreateRequest)))
                    .andExpect(status().isCreated())
                    .andReturn().getResponse().getContentAsString();

            Long id = extractIdFromResponse(createResponse);

            // Delete it
            mockMvc.perform(delete("/todos/" + id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("ToDo deleted successfully"))
                    .andExpect(jsonPath("$.data.id").value(id));

            // Verify it's deleted
            mockMvc.perform(get("/todos/" + id))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("Get All ToDos Endpoint Tests")
    class GetAllToDosTests {

        @Test
        @DisplayName("Should retrieve paginated ToDos successfully")
        void shouldRetrievePaginatedToDos() throws Exception {
            // Create multiple ToDos
            for (int i = 0; i < 5; i++) {
                ToDoCreateRequest request = new ToDoCreateRequest();
                request.setText("ToDo " + i);
                request.setPriority(Priority.MEDIUM);

                mockMvc.perform(post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                        .andExpect(status().isCreated());
            }

            // Retrieve first page
            mockMvc.perform(get("/todos")
                    .param("page", "0")
                    .param("size", "3"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isArray())
                    .andExpect(jsonPath("$.data.length()").value(3))
                    .andExpect(jsonPath("$.total").value(5))
                    .andExpect(jsonPath("$.page").value(0))
                    .andExpect(jsonPath("$.size").value(3));
        }

        @Test
        @DisplayName("Should filter ToDos by completion status")
        void shouldFilterToDosByCompletionStatus() throws Exception {
            // Create and mark some ToDos as done
            for (int i = 0; i < 3; i++) {
                ToDoCreateRequest request = new ToDoCreateRequest();
                request.setText("ToDo " + i);
                request.setPriority(Priority.MEDIUM);

                String response = mockMvc.perform(post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                        .andExpect(status().isCreated())
                        .andReturn().getResponse().getContentAsString();

                if (i < 2) { // Mark first 2 as done
                    Long id = extractIdFromResponse(response);
                    mockMvc.perform(post("/todos/" + id + "/done"))
                            .andExpect(status().isOk());
                }
            }

            // Filter for completed ToDos
            mockMvc.perform(get("/todos")
                    .param("complete", "done"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.length()").value(2));

            // Filter for pending ToDos
            mockMvc.perform(get("/todos")
                    .param("complete", "pending"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.length()").value(1));
        }
    }

    @Nested
    @DisplayName("Statistics Endpoint Tests")
    class StatisticsTests {

        @Test
        @DisplayName("Should retrieve completion statistics")
        void shouldRetrieveCompletionStatistics() throws Exception {
            mockMvc.perform(get("/todos/stats"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Statistics retrieved successfully"))
                    .andExpect(jsonPath("$.data").isMap())
                    .andExpect(jsonPath("$.data.HIGH").exists())
                    .andExpect(jsonPath("$.data.MEDIUM").exists())
                    .andExpect(jsonPath("$.data.LOW").exists());
        }
    }

    @Nested
    @DisplayName("Overdue ToDos Endpoint Tests")
    class OverdueTests {

        @Test
        @DisplayName("Should retrieve overdue ToDos")
        void shouldRetrieveOverdueToDos() throws Exception {
            // Create an overdue ToDo
            ToDoCreateRequest overdueRequest = new ToDoCreateRequest();
            overdueRequest.setText("Overdue ToDo");
            overdueRequest.setPriority(Priority.HIGH);
            overdueRequest.setDueDate(LocalDateTime.now().minusDays(1)); // Past due date

            mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(overdueRequest)))
                    .andExpect(status().isCreated());

            // Retrieve overdue ToDos
            mockMvc.perform(get("/todos/overdue"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isArray())
                    .andExpect(jsonPath("$.data.length()").value(1))
                    .andExpect(jsonPath("$.data[0].text").value("Overdue ToDo"));
        }
    }

    /**
     * Helper method to extract ID from create response JSON.
     */
    private Long extractIdFromResponse(String responseJson) throws Exception {
        return objectMapper.readTree(responseJson)
                .path("data")
                .path("id")
                .asLong();
    }
}
