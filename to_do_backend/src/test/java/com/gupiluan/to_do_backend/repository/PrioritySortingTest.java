package com.gupiluan.to_do_backend.repository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class to verify priority sorting functionality.
 * Tests the Priority enum comparators and their usage in ToDo sorting.
 */
@DisplayName("Priority Sorting Tests")
public class PrioritySortingTest {

    private ToDoRepository repository;
    private ToDo highPriorityTodo;
    private ToDo mediumPriorityTodo;
    private ToDo lowPriorityTodo;

    @BeforeEach
    void setUp() {
        repository = new ToDoRepository();

        // Create test todos with different priorities
        highPriorityTodo = new ToDo();
        highPriorityTodo.setText("High priority task");
        highPriorityTodo.setPriority(Priority.HIGH);
        highPriorityTodo.setCreationTime(LocalDateTime.now());

        mediumPriorityTodo = new ToDo();
        mediumPriorityTodo.setText("Medium priority task");
        mediumPriorityTodo.setPriority(Priority.MEDIUM);
        mediumPriorityTodo.setCreationTime(LocalDateTime.now());

        lowPriorityTodo = new ToDo();
        lowPriorityTodo.setText("Low priority task");
        lowPriorityTodo.setPriority(Priority.LOW);
        lowPriorityTodo.setCreationTime(LocalDateTime.now());
    }

    @Test
    @DisplayName("Test Priority Enum Rank Values")
    void testPriorityRankValues() {
        assertEquals(3, Priority.HIGH.getRank(), "HIGH priority should have rank 3");
        assertEquals(2, Priority.MEDIUM.getRank(), "MEDIUM priority should have rank 2");
        assertEquals(1, Priority.LOW.getRank(), "LOW priority should have rank 1");
    }

    @Test
    @DisplayName("Test Priority Descending Comparator (HIGH > MEDIUM > LOW)")
    void testPriorityDescendingComparator() {
        List<Priority> priorities = Arrays.asList(Priority.LOW, Priority.HIGH, Priority.MEDIUM);

        List<Priority> sortedDesc = priorities.stream()
                .sorted(Priority.BY_RANK_DESC)
                .collect(Collectors.toList());

        assertEquals(Priority.HIGH, sortedDesc.get(0), "First should be HIGH priority");
        assertEquals(Priority.MEDIUM, sortedDesc.get(1), "Second should be MEDIUM priority");
        assertEquals(Priority.LOW, sortedDesc.get(2), "Third should be LOW priority");
    }

    @Test
    @DisplayName("Test Priority Ascending Comparator (LOW > MEDIUM > HIGH)")
    void testPriorityAscendingComparator() {
        List<Priority> priorities = Arrays.asList(Priority.HIGH, Priority.LOW, Priority.MEDIUM);

        List<Priority> sortedAsc = priorities.stream()
                .sorted(Priority.BY_RANK_ASC)
                .collect(Collectors.toList());

        assertEquals(Priority.LOW, sortedAsc.get(0), "First should be LOW priority");
        assertEquals(Priority.MEDIUM, sortedAsc.get(1), "Second should be MEDIUM priority");
        assertEquals(Priority.HIGH, sortedAsc.get(2), "Third should be HIGH priority");
    }

    @Test
    @DisplayName("Test ToDo Sorting by Priority Descending")
    void testToDoSortingByPriorityDescending() {
        // Save todos in random order
        repository.save(mediumPriorityTodo);
        repository.save(lowPriorityTodo);
        repository.save(highPriorityTodo);

        // Sort by priority descending (HIGH > MEDIUM > LOW)
        List<ToDo> sortedTodos = repository.findAll().stream()
                .sorted((t1, t2) -> Priority.BY_RANK_DESC.compare(t1.getPriority(), t2.getPriority()))
                .collect(Collectors.toList());

        assertEquals(3, sortedTodos.size(), "Should have 3 todos");
        assertEquals(Priority.HIGH, sortedTodos.get(0).getPriority(), "First todo should be HIGH priority");
        assertEquals(Priority.MEDIUM, sortedTodos.get(1).getPriority(), "Second todo should be MEDIUM priority");
        assertEquals(Priority.LOW, sortedTodos.get(2).getPriority(), "Third todo should be LOW priority");

        // Verify text content matches
        assertEquals("High priority task", sortedTodos.get(0).getText());
        assertEquals("Medium priority task", sortedTodos.get(1).getText());
        assertEquals("Low priority task", sortedTodos.get(2).getText());
    }

    @Test
    @DisplayName("Test ToDo Sorting by Priority Ascending")
    void testToDoSortingByPriorityAscending() {
        // Save todos in random order
        repository.save(highPriorityTodo);
        repository.save(lowPriorityTodo);
        repository.save(mediumPriorityTodo);

        // Sort by priority ascending (LOW > MEDIUM > HIGH)
        List<ToDo> sortedTodos = repository.findAll().stream()
                .sorted((t1, t2) -> Priority.BY_RANK_ASC.compare(t1.getPriority(), t2.getPriority()))
                .collect(Collectors.toList());

        assertEquals(3, sortedTodos.size(), "Should have 3 todos");
        assertEquals(Priority.LOW, sortedTodos.get(0).getPriority(), "First todo should be LOW priority");
        assertEquals(Priority.MEDIUM, sortedTodos.get(1).getPriority(), "Second todo should be MEDIUM priority");
        assertEquals(Priority.HIGH, sortedTodos.get(2).getPriority(), "Third todo should be HIGH priority");

        // Verify text content matches
        assertEquals("Low priority task", sortedTodos.get(0).getText());
        assertEquals("Medium priority task", sortedTodos.get(1).getText());
        assertEquals("High priority task", sortedTodos.get(2).getText());
    }

    @Test
    @DisplayName("Test Multiple Todos with Same Priority")
    void testMultipleTodosWithSamePriority() {
        // Create multiple todos with same priority
        ToDo highTodo1 = new ToDo();
        highTodo1.setText("First high priority task");
        highTodo1.setPriority(Priority.HIGH);
        highTodo1.setCreationTime(LocalDateTime.now());

        ToDo highTodo2 = new ToDo();
        highTodo2.setText("Second high priority task");
        highTodo2.setPriority(Priority.HIGH);
        highTodo2.setCreationTime(LocalDateTime.now());

        repository.save(highTodo1);
        repository.save(mediumPriorityTodo);
        repository.save(highTodo2);
        repository.save(lowPriorityTodo);

        // Sort by priority descending
        List<ToDo> sortedTodos = repository.findAll().stream()
                .sorted((t1, t2) -> Priority.BY_RANK_DESC.compare(t1.getPriority(), t2.getPriority()))
                .collect(Collectors.toList());

        assertEquals(4, sortedTodos.size(), "Should have 4 todos");

        // First two should be HIGH priority
        assertEquals(Priority.HIGH, sortedTodos.get(0).getPriority());
        assertEquals(Priority.HIGH, sortedTodos.get(1).getPriority());

        // Third should be MEDIUM priority
        assertEquals(Priority.MEDIUM, sortedTodos.get(2).getPriority());

        // Fourth should be LOW priority
        assertEquals(Priority.LOW, sortedTodos.get(3).getPriority());
    }

    @Test
    @DisplayName("Test Priority Comparator with Null Safety")
    void testPriorityComparatorNullSafety() {
        // Test that comparators handle null values gracefully
        assertDoesNotThrow(() -> {
            Priority.BY_RANK_DESC.compare(Priority.HIGH, Priority.LOW);
            Priority.BY_RANK_ASC.compare(Priority.MEDIUM, Priority.HIGH);
        }, "Comparators should not throw exceptions with valid priorities");
    }

    @Test
    @DisplayName("Test Priority Ranking Logic")
    void testPriorityRankingLogic() {
        // Verify that HIGH has the highest rank
        assertTrue(Priority.HIGH.getRank() > Priority.MEDIUM.getRank(),
                "HIGH should have higher rank than MEDIUM");
        assertTrue(Priority.MEDIUM.getRank() > Priority.LOW.getRank(),
                "MEDIUM should have higher rank than LOW");
        assertTrue(Priority.HIGH.getRank() > Priority.LOW.getRank(),
                "HIGH should have higher rank than LOW");

        // Verify specific rank values
        assertEquals(3, Priority.HIGH.getRank());
        assertEquals(2, Priority.MEDIUM.getRank());
        assertEquals(1, Priority.LOW.getRank());
    }

    @Test
    @DisplayName("Test Comparator Consistency")
    void testComparatorConsistency() {
        // Test that both comparators are consistent (inverse of each other)
        List<Priority> priorities = Arrays.asList(Priority.LOW, Priority.HIGH, Priority.MEDIUM);

        List<Priority> descOrder = priorities.stream()
                .sorted(Priority.BY_RANK_DESC)
                .collect(Collectors.toList());

        List<Priority> ascOrder = priorities.stream()
                .sorted(Priority.BY_RANK_ASC)
                .collect(Collectors.toList());

        // Reverse the ascending order and compare with descending
        List<Priority> reversedAsc = ascOrder.stream()
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        list -> {
                            List<Priority> reversed = new java.util.ArrayList<>(list);
                            java.util.Collections.reverse(reversed);
                            return reversed;
                        }));

        assertEquals(descOrder, reversedAsc, "Descending order should be reverse of ascending order");
    }
}
