package com.gupiluan.to_do_backend.model;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ToDo {
    private Long id;
    @NotBlank
    @Size(min = 1, max = 120, message = "Max length is {max} chars.")
    private String text;
    private LocalDateTime dueDate = null;
    private boolean doneFlag = false;
    private LocalDateTime doneDate = null;
    @NotNull
    private Priority priority;
    private LocalDateTime creationTime = LocalDateTime.now();

    public ToDo(Long id, String text, LocalDateTime dueDate, Priority priority) {
        this.id = id;
        this.text = text;
        this.dueDate = dueDate;
        this.priority = priority;
    }

}
