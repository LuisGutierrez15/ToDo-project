package com.gupiluan.to_do_backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;
import com.gupiluan.to_do_backend.repository.IToDoRepository;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ToDoServiceTest {
    @MockitoBean
    private IToDoRepository toDoRepository;
    @Autowired
    private ToDoService toDoService;

    private static Map<Long, ToDo> toDos;
    private static Long count;

    @BeforeAll
    public static void setUp() {
        toDos = new HashMap<>();
        count = 1L;
    }

    @Test
    @Order(1)
    public void createSuccess() {
        createToDo();
        ToDo toDo = new ToDo(null, "test", null, Priority.MEDIUM);
        ToDo response = toDoService.createToDo(toDo);
        assertNotNull(response);
    }

    @Test
    @Order(2)
    public void createErrorLengthText() {
        createToDo();
        String textgreater120 = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest" +
                "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        ToDo toDo = new ToDo(null, textgreater120, null, Priority.MEDIUM);
        ToDo response = toDoService.createToDo(toDo);
        assertNull(response);
    }

    @Test
    @Order(3)
    public void createErrorNoPriority() {
        createToDo();
        ToDo toDo = new ToDo(null, "test", null, null);
        ToDo response = toDoService.createToDo(toDo);
        assertNull(response);
    }

    @Test
    @Order(4)
    public void createErrorSameId() {
        createToDo();
        ToDo toDo = new ToDo(1L, "test", null, null);
        ToDo response = toDoService.createToDo(toDo);
        assertNull(response);
    }

    @Test
    @Order(5)
    public void foundById() {
        Long toDoId = 1L;
        findById();
        assertNotNull(toDoService.getToDo(toDoId));
    }

    @Test
    @Order(6)
    public void notFoundById() {
        Long toDoId = 2L;
        findById();
        assertNull(toDoService.getToDo(toDoId));
    }

    @Test
    @Order(7)
    public void setDone() {
        Long toDoId = 1L;
        findById();
        updateById();
        assertTrue(toDoService.markDone(toDoId));
    }

    @Test
    @Order(8)
    public void setUnDone() {
        Long toDoId = 1L;
        findById();
        updateById();
        assertTrue(toDoService.markUnDone(toDoId));
    }

    @Test
    @Order(9)
    public void setDoneIfNoExists() {
        Long toDoId = 2L;
        findById();
        updateById();
        assertFalse(toDoService.markDone(toDoId));
    }

    @Test
    @Order(10)
    public void setUnDoneIfNoExists() {
        Long toDoId = 2L;
        findById();
        updateById();
        assertFalse(toDoService.markUnDone(toDoId));
    }

    @Test
    @Order(11)
    public void getFirstPage() {
        getAll();
        int lengthOfPage = toDoService.getAllToDos(0, 10, null, null, null, null, null).getData().size();
        assertTrue(lengthOfPage > 0);

    }

    @Test
    @Order(12)
    public void getSecondPage() {
        getAll();
        int lengthOfPage = toDoService.getAllToDos(1, 10, null, null, null, null, null).getData().size();
        assertTrue(lengthOfPage == 0);
    }

    @Test
    @Order(13)
    public void updateExistingToDo() {
        updateById();
        findById();
        Long id = 1L;
        ToDo toDoToChange = toDoService.getToDo(id);
        toDoToChange.setText("new text");
        boolean updated = toDoService.updateToDo(id, toDoToChange);
        assertTrue(updated);
    }

    @Test
    @Order(14)
    public void updateExistingToDoWithErrorTextLength() {
        updateById();
        findById();
        Long id = 1L;
        ToDo toDoToChange = toDoService.getToDo(id);
        String textgreater120 = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest" +
                "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        toDoToChange.setText(textgreater120);
        boolean updated = toDoService.updateToDo(id, toDoToChange);
        assertFalse(updated);
    }

    @Test
    @Order(15)
    public void updateExistingToDoWithErrorPriority() {
        updateById();
        findById();
        Long id = 1L;
        ToDo toDoToChange = toDoService.getToDo(id);
        toDoToChange.setPriority(null);
        boolean updated = toDoService.updateToDo(id, toDoToChange);
        assertFalse(updated);
    }

    @Test
    @Order(16)
    public void updateNonExistingToDo() {
        updateById();
        findById();
        Long id = 2L;
        ToDo toDoToChange = toDoService.getToDo(id);
        if (toDoToChange != null) {
            toDoToChange.setText("new text");

        }
        boolean updated = toDoService.updateToDo(id, toDoToChange);
        assertFalse(updated);
    }

    @Test
    @Order(17)
    public void deleteNonExistingToDo() {
        deleteById();
        findById();
        Long id = 2L;
        ToDo deleted = toDoService.deleteToDo(id);
        assertNull(deleted);
    }

    @Test
    @Order(18)
    public void deleteExistingToDo() {
        deleteById();
        findById();
        Long id = 1L;
        ToDo deleted = toDoService.deleteToDo(id);
        assertNotNull(deleted);
    }

    @Test
    @Order(19)
    public void createManyToDos() {
        createToDo();
        assertTrue(toDos.size() == 0);
        ToDo toDo = new ToDo(null, "test", null, Priority.MEDIUM);
        ToDo toDo2 = new ToDo(null, "test1", null, Priority.HIGH);
        ToDo toDo3 = new ToDo(null, "test2", null, Priority.LOW);
        ToDo toDo4 = new ToDo(null, "test3", null, Priority.MEDIUM);
        List<ToDo> req = List.of(toDo, toDo2, toDo3, toDo4);

        int errors = toDoService.createToDos(req);
        assertFalse(toDos.size() == 0);
        assertEquals(0, errors);

    }

    @Test
    @Order(20)
    public void createManyToDosWithErrors() {
        createToDo();
        String textgreater120 = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest" +
                "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        ToDo toDo = new ToDo(null, "test", null, Priority.MEDIUM);
        ToDo toDo2 = new ToDo(null, "test1", null, null);
        ToDo toDo3 = new ToDo(null, "test2", null, Priority.LOW);
        ToDo toDo4 = new ToDo(null, textgreater120, null, Priority.MEDIUM);
        List<ToDo> req = List.of(toDo, toDo2, toDo3, toDo4);
        int errors = toDoService.createToDos(req);
        assertEquals(2, errors);

    }

    private void createToDo() {
        when(toDoRepository.save(any(ToDo.class))).thenAnswer(new Answer<ToDo>() {
            public ToDo answer(InvocationOnMock invocationOnMock) throws Throwable {
                ToDo newTodo = (ToDo) invocationOnMock.getArguments()[0];
                if (newTodo.getId() == null) {
                    newTodo.setId(count++);
                } else if (toDos.containsKey(newTodo.getId())) {
                    return null;
                }
                toDos.put(newTodo.getId(), newTodo);
                return newTodo;
            }
        });
    }

    private void findById() {
        when(toDoRepository.findById(anyLong())).thenAnswer(new Answer<Optional<ToDo>>() {
            public Optional<ToDo> answer(InvocationOnMock invocationOnMock) throws Throwable {
                Long id = (Long) invocationOnMock.getArguments()[0];
                return Optional.ofNullable(toDos.get(id));
            }
        });
    }

    private void getAll() {
        when(toDoRepository.findAll()).thenReturn(toDos.values().stream().collect(Collectors.toList()));
    }

    private void updateById() {
        when(toDoRepository.update(any(ToDo.class))).thenAnswer(new Answer<Boolean>() {
            public Boolean answer(InvocationOnMock invocationOnMock) throws Throwable {
                ToDo toDo = (ToDo) invocationOnMock.getArguments()[0];
                Long id = toDo.getId();
                ToDo toDoOld = toDoRepository.findById(id).orElse(null);
                return toDos.replace(id, toDoOld, toDo);
            }
        });
    }

    private void deleteById() {
        when(toDoRepository.deleteById(anyLong())).thenAnswer(new Answer<ToDo>() {
            public ToDo answer(InvocationOnMock invocationOnMock) throws Throwable {
                Long id = (Long) invocationOnMock.getArguments()[0];
                return toDos.remove(id);
            }
        });
    }

}
