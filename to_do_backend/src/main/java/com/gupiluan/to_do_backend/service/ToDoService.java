package com.gupiluan.to_do_backend.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;
import com.gupiluan.to_do_backend.repository.IToDoRepository;

@Service
public class ToDoService {
    @Autowired
    private IToDoRepository toDoRepository;

    public ToDo getToDo(Long id) {
        return toDoRepository.findById(id).orElse(null);
    }

    public boolean createToDo(ToDo toDo) {
        return toDo.getText().length() <= 120 && toDo.getPriority() != null && toDoRepository.save(toDo) != null;
    }

    public List<ToDo> getAllToDos(int page, int size, String name, String complete, Priority priority,
            String sortByDueDate, String sortByPriority) {

        Comparator<ToDo> firstComparator = getComparator(ToDo::getDueDate, sortByDueDate);
        Comparator<ToDo> secondComparator = getComparator(ToDo::getPriority, sortByPriority);

        List<ToDo> listOfToDo = toDoRepository.findAll().stream()
                .filter(t -> name == null || t.getText().toLowerCase().contains(name.toLowerCase()))
                .filter(t -> complete == null || t.isDoneFlag() == complete.equalsIgnoreCase("done"))
                .filter(t -> priority == null || t.getPriority() == priority)
                .sorted(firstComparator.thenComparing(secondComparator))
                .collect(Collectors.toList());

        int total = listOfToDo.size();
        int start = page * size;
        int end = Math.min(start + size, total);
        List<ToDo> pageContent = (start > total) ? List.of() : listOfToDo.subList(start, end);
        return pageContent;
    }

    public float getAvgFromAll() {
        return getAvgFromAll(null);
    }

    public float getAvgFromAll(Priority priority) {
        int result = 0;
        List<ToDo> all = toDoRepository.findAll().stream().filter(t -> t.isDoneFlag() == true)
                .filter(t -> priority == null || t.getPriority() == priority)
                .collect(Collectors.toList());
        for (ToDo toDo : all) {
            result += toDoRepository.getDurationBetween(toDo.getCreationTime(), toDo.getDoneDate()).toMinutesPart();
        }
        int size = all.size();
        return size > 0 ? result / all.size() : 0;
    }

    public boolean markDone(Long id) {
        ToDo toDo = toDoRepository.findById(id).orElse(null);
        if (toDo == null) {
            return false;
        }
        toDo.setDoneFlag(true);
        toDo.setDoneDate(LocalDateTime.now());
        return toDoRepository.update(toDo);
    }

    public boolean markUnDone(Long id) {
        ToDo toDo = toDoRepository.findById(id).orElse(null);
        if (toDo == null) {
            return false;
        }
        toDo.setDoneFlag(false);
        toDo.setDoneDate(null);
        return toDoRepository.update(toDo);
    }

    public boolean updateToDo(Long id, ToDo toDo) {
        boolean notFound = !toDoRepository.findById(id).isPresent();
        if (notFound) {
            return false;
        }
        toDo.setId(id);
        return toDoRepository.update(toDo);
    }

    private <T, U extends Comparable<? super U>> Comparator<ToDo> getComparator(
            Function<? super ToDo, ? extends U> keyStractor, String order) {
        Comparator<ToDo> defaultComparator = Comparator.comparing(e -> 0);
        Comparator<ToDo> resultComparator = Comparator.comparing(keyStractor);
        resultComparator = order != null
                ? order.equalsIgnoreCase("asc") ? resultComparator : resultComparator.reversed()
                : defaultComparator;
        return resultComparator;
    }

}
