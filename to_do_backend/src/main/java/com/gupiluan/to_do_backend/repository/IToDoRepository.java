package com.gupiluan.to_do_backend.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.gupiluan.to_do_backend.model.ToDo;

public interface IToDoRepository {
    List<ToDo> findAll();

    Optional<ToDo> findById(Long id);

    ToDo save(ToDo toDo);

    boolean update(ToDo toDo);

    ToDo deleteById(Long id);

    Duration getDurationBetween(LocalDateTime a, LocalDateTime b);

}
