package com.gupiluan.to_do_backend.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Repository;

import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;

/**
 * In-memory implementation of the ToDo repository.
 * Provides efficient data access operations using HashMap storage.
 * Includes pagination and filtering capabilities similar to JPA repositories.
 * 
 * @author gupiluan
 */
@Repository
public class ToDoRepository implements IToDoRepository {

    /** In-memory storage for ToDo items */
    private final Map<Long, ToDo> toDos = new HashMap<>();

    /** Counter for generating unique IDs */
    private Long idCounter = 1L;

    @Override
    public Optional<ToDo> findById(Long id) {
        return Optional.ofNullable(toDos.get(id));
    }

    @Override
    public ToDo save(ToDo toDo) {
        if (toDo.getId() == null) {
            toDo.setId(idCounter++);
            if (toDo.getCreationTime() == null) {
                toDo.setCreationTime(LocalDateTime.now());
            }
        }
        toDos.put(toDo.getId(), toDo);
        return toDo;
    }

    @Override
    public boolean update(ToDo toDo) {
        if (toDo.getId() == null || !toDos.containsKey(toDo.getId())) {
            return false;
        }

        ToDo existing = toDos.get(toDo.getId());
        // Preserve creation time during updates
        if (existing.getCreationTime() != null) {
            toDo.setCreationTime(existing.getCreationTime());
        }

        toDos.put(toDo.getId(), toDo);
        return true;
    }

    @Override
    public ToDo deleteByIdAndReturn(Long id) {
        return toDos.remove(id);
    }

    @Override
    public void deleteAll() {
        toDos.clear();
        idCounter = 1L; // Reset the ID counter
    }

    @Override
    public List<ToDo> findAll() {
        return toDos.values().stream()
                .sorted((a, b) -> a.getId().compareTo(b.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Page<ToDo> findWithFilters(String text, Boolean doneFlag, Priority priority, Pageable pageable) {
        List<ToDo> filtered = toDos.values().stream()
                .filter(t -> text == null || t.getText().toLowerCase().contains(text.toLowerCase()))
                .filter(t -> doneFlag == null || t.isDoneFlag() == doneFlag)
                .filter(t -> priority == null || t.getPriority() == priority)
                .collect(Collectors.toList());

        return createPage(filtered, pageable);
    }

    @Override
    public List<ToDo> findCompletedByPriority(Priority priority) {
        return toDos.values().stream()
                .filter(t -> t.isDoneFlag() && t.getPriority() == priority)
                .collect(Collectors.toList());
    }

    @Override
    public Duration getDurationBetween(LocalDateTime start, LocalDateTime end) {
        return Duration.between(start, end);
    }

    @Override
    public List<ToDo> findByDoneFlag(boolean doneFlag) {
        return toDos.values().stream()
                .filter(t -> t.isDoneFlag() == doneFlag)
                .collect(Collectors.toList());
    }

    @Override
    public List<ToDo> findByPriority(Priority priority) {
        return toDos.values().stream()
                .filter(t -> t.getPriority() == priority)
                .collect(Collectors.toList());
    }

    @Override
    public List<ToDo> findByDueDateBeforeAndDoneFlagFalse(LocalDateTime date) {
        return toDos.values().stream()
                .filter(t -> !t.isDoneFlag())
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(date))
                .collect(Collectors.toList());
    }

    /**
     * Helper method to create a page from a list of items.
     * Applies sorting and pagination as specified in the Pageable parameter.
     * 
     * @param items    the list of items to paginate
     * @param pageable pagination and sorting specification
     * @return Page containing the requested subset of items
     */
    private Page<ToDo> createPage(List<ToDo> items, Pageable pageable) {
        if (pageable.getSort().isSorted()) {
            items = applySorting(items, pageable.getSort());
        }

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), items.size());

        List<ToDo> pageContent = start > items.size() ? List.of() : items.subList(start, end);

        return new PageImpl<>(pageContent, pageable, items.size());
    }

    /**
     * Helper method to apply sorting to a list of ToDo items.
     * Supports sorting by common ToDo fields.
     * 
     * @param items the list of items to sort
     * @param sort  the sorting specification
     * @return sorted list of items
     */
    private List<ToDo> applySorting(List<ToDo> items, Sort sort) {
        return items.stream()
                .sorted((a, b) -> {
                    for (Order order : sort) {
                        String property = order.getProperty();
                        boolean ascending = order.isAscending();
                        System.out.println();
                        int comparison = compareByField(a, b, property);

                        if (comparison != 0) {
                            return ascending ? comparison : -comparison;
                        }
                    }
                    return 0;
                })
                .collect(Collectors.toList());

    }

    /**
     * Helper method to compare ToDo items by field name.
     * Supports comparison for all major ToDo fields.
     * 
     * @param a     first ToDo item
     * @param b     second ToDo item
     * @param field the field name to compare by
     * @return comparison result (-1, 0, or 1)
     */
    private int compareByField(ToDo a, ToDo b, String field) {
        switch (field) {
            case "id":
                return a.getId().compareTo(b.getId());
            case "text":
                return a.getText().compareTo(b.getText());
            case "dueDate":
                if (a.getDueDate() == null && b.getDueDate() == null)
                    return 0;
                if (a.getDueDate() == null)
                    return 1;
                if (b.getDueDate() == null)
                    return -1;
                return a.getDueDate().compareTo(b.getDueDate());
            case "priority":
                return Integer.compare(a.getPriority().getRank(), b.getPriority().getRank());
            case "creationTime":
                return a.getCreationTime().compareTo(b.getCreationTime());
            case "doneFlag":
                return Boolean.compare(a.isDoneFlag(), b.isDoneFlag());
            default:
                return 0;
        }
    }

}
