package com.gupiluan.to_do_backend.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gupiluan.to_do_backend.model.Pagination;
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

    public ToDo createToDo(ToDo toDo) {
        return toDo.getText().length() > 0 && toDo.getText().length() <= 120 && toDo.getPriority() != null
                ? toDoRepository.save(toDo)
                : null;
    }

    public int createToDos(List<ToDo> toDos) {
        int fail = 0;
        for (ToDo toDo : toDos) {
            if (toDo.getText().length() > 0 && toDo.getText().length() <= 120 && toDo.getPriority() != null) {
                toDoRepository.save(toDo);
                continue;
            }
            fail++;
        }
        return fail;
    }

    public Pagination<List<ToDo>> getAllToDos(int page, int size, String name, String complete, Priority priority,
            String sortByDueDate, String sortByPriority) {

        Comparator<ToDo> firstComparator = getComparator(ToDo::getDueDate, sortByDueDate);
        Comparator<ToDo> secondComparator = getComparator(ToDo::getPriority, sortByPriority);

        List<ToDo> listOfToDo = toDoRepository.findAll().stream()
                .sorted(Comparator.comparing(ToDo::getId))
                .filter(t -> name == null || t.getText().toLowerCase().contains(name.toLowerCase()))
                .filter(t -> complete == null || t.isDoneFlag() == complete.equalsIgnoreCase("done"))
                .filter(t -> priority == null || t.getPriority() == priority)
                .sorted(firstComparator.thenComparing(secondComparator))
                .collect(Collectors.toList());

        int total = listOfToDo.size();
        int start = page * size;
        int end = Math.min(start + size, total);
        List<ToDo> pageContent = (start > total) ? List.of() : listOfToDo.subList(start, end);
        String message = pageContent.size() > 0 ? "success" : "empty";
        return new Pagination<List<ToDo>>(message, pageContent, total);
    }

    public ToDo deleteToDo(Long id) {
        return toDoRepository.deleteById(id);
    }

    public Map<Priority, Integer> getAvgFromAll() {
        Map<Priority, Integer> map = new HashMap<>();
        for (Priority p : Priority.values()) {
            int result = 0;
            List<ToDo> all = toDoRepository.findAll().stream().filter(t -> t.isDoneFlag() == true)
                    .filter(t -> t.getPriority() == p)
                    .collect(Collectors.toList());
            for (ToDo toDo : all) {
                result += toDoRepository.getDurationBetween(toDo.getCreationTime(), toDo.getDoneDate()).toMinutes();
            }
            int size = all.size();
            map.put(p, size > 0 ? result / all.size() : 0);
        }
        return map;
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
        return toDo.getText().length() > 0 && toDo.getText().length() <= 120 && toDo.getPriority() != null
                && toDoRepository.update(toDo);
    }

    private <T, U extends Comparable<? super U>> Comparator<ToDo> getComparator(
            Function<? super ToDo, ? extends U> keyStractor, String order) {
        Comparator<ToDo> defaultComparator = Comparator.comparing(e -> 0);
        Comparator<ToDo> resultComparator = Comparator.comparing(keyStractor,
                Comparator.nullsLast(Comparator.naturalOrder()));
        resultComparator = order != null
                ? order.equalsIgnoreCase("asc") ? resultComparator : resultComparator.reversed()
                : defaultComparator;
        return resultComparator;
    }

}
