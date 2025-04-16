package com.gupiluan.to_do_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gupiluan.to_do_backend.model.ApiResponse;
import com.gupiluan.to_do_backend.model.Pagination;
import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;
import com.gupiluan.to_do_backend.service.ToDoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "http://localhost:8080")
public class ToDoController {
    @Autowired
    private ToDoService toDoService;

    @GetMapping
    public ResponseEntity<Pagination<List<ToDo>>> getAll(@RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false) String complete,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String sortByPriority,
            @RequestParam(required = false) String sortByDueDate) {
        Pagination<List<ToDo>> pagination = toDoService.getAllToDos(page, size, name, complete, priority, sortByDueDate,
                sortByPriority);
        return new ResponseEntity<>(pagination, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ToDo>> getToDo(@PathVariable Long id) {
        ToDo toDo = toDoService.getToDo(id);
        boolean notFound = toDo == null;
        String message = notFound ? "error" : "success";
        ApiResponse<ToDo> response = new ApiResponse<>(message, toDo);
        return new ResponseEntity<>(response, notFound ? HttpStatus.NOT_FOUND : HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ToDo>> createToDo(@RequestBody @Valid ToDo toDo) {
        ToDo created = toDoService.createToDo(toDo);
        String message = created != null ? "success" : "error";
        ApiResponse<ToDo> response = new ApiResponse<>(message, created);
        return new ResponseEntity<>(response, created != null ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/many")
    public ResponseEntity<ApiResponse<Integer>> createToDos(@RequestBody List<ToDo> toDos) {
        int errors = toDoService.createToDos(toDos);
        String message = errors == 0 ? "success" : "error";
        ApiResponse<Integer> response = new ApiResponse<>(message, errors);
        return new ResponseEntity<>(response, errors == 0 ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> updateToDo(@RequestBody @Valid ToDo toDo, @PathVariable Long id) {
        boolean updated = toDoService.updateToDo(id, toDo);
        String message = updated ? "success" : "error";
        ApiResponse<Boolean> response = new ApiResponse<>(message, updated);
        return new ResponseEntity<>(response, updated ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/{id}/done")
    public ResponseEntity<ApiResponse<Boolean>> markDone(@PathVariable Long id) {
        boolean updated = toDoService.markDone(id);
        String message = updated ? "success" : "error";
        ApiResponse<Boolean> response = new ApiResponse<>(message, updated);
        return new ResponseEntity<>(response, updated ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}/undone")
    public ResponseEntity<ApiResponse<Boolean>> markUnDone(@PathVariable Long id) {
        boolean updated = toDoService.markUnDone(id);
        String message = updated ? "success" : "error";
        ApiResponse<Boolean> response = new ApiResponse<>(message, updated);
        return new ResponseEntity<>(response, updated ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<ToDo>> deleteToDo(@PathVariable Long id) {
        ToDo deleted = toDoService.deleteToDo(id);
        String message = deleted != null ? "success" : "error";
        ApiResponse<ToDo> response = new ApiResponse<>(message, deleted);
        return new ResponseEntity<>(response, deleted != null ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<Priority, Integer>>> getStatistics() {
        Map<Priority, Integer> stat = toDoService.getAvgFromAll();
        String message = "success";
        ApiResponse<Map<Priority, Integer>> response = new ApiResponse<>(message, stat);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
