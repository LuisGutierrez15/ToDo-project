package com.gupiluan.to_do_backend.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.gupiluan.to_do_backend.model.ToDo;

@Repository
public class ToDoRepository implements IToDoRepository {

    private Map<Long, ToDo> toDos = new HashMap<>();
    private Long count = 1L;

    @Override
    public Optional<ToDo> findById(Long id) {
        return Optional.ofNullable(toDos.get(id));
    }

    @Override
    public ToDo save(ToDo toDo) {
        if (toDo.getId() == null) {
            toDo.setId(count++);
        } else if (toDos.containsKey(toDo.getId())) {
            return null;
        }
        toDos.put(toDo.getId(), toDo);
        return toDo;
    }

    @Override
    public ToDo deleteById(Long id) {
        return toDos.remove(id);
    }

    @Override
    public boolean update(ToDo toDo) {
        Long id = toDo.getId();
        ToDo toDoOld = findById(id).get();
        return toDos.replace(id, toDoOld, toDo);
    }

    @Override
    public List<ToDo> findAll() {
        List<ToDo> listOfToDo = toDos.values().stream().collect(Collectors.toList());
        return listOfToDo;
    }

    @Override
    public Duration getDurationBetween(LocalDateTime a, LocalDateTime b) {
        return Duration.between(a, b);
    }

}
