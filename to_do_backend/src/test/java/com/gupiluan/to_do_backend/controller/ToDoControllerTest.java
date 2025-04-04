package com.gupiluan.to_do_backend.controller;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureRestDocs
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ToDoControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    @Order(1)
    public void createToDoPass() throws Exception {
        String toDoJSON = "{\n" + //
                "    \"text\" : \"test\",\n" + //
                "    \"priority\" : \"MEDIUM\"\n" + //
                "}";
        mockMvc.perform(post("/todos").contentType(MediaType.APPLICATION_JSON).content(toDoJSON))
                .andExpect(status().isCreated()).andDo(document("create-todo-pass"));

    }

    @Test
    @Order(2)
    public void createToDoError() throws Exception {
        String toDoJSON = "{\n" + //
                "    \"text\" : \"testWrong\",\n" + //
                "}";
        mockMvc.perform(post("/todos").contentType(MediaType.APPLICATION_JSON).content(toDoJSON))
                .andExpect(status().isBadRequest()).andDo(document("create-todo-wrong"));

    }

    @Test
    @Order(3)
    public void getOneAndFound() throws Exception {
        Long id = 1L;
        mockMvc.perform(get(String.format("/todos/%d", id))).andExpect(status().isOk())
                .andDo(document("find-todo-pass"));

    }

    @Test
    @Order(4)
    public void getOneAndNotFound() throws Exception {
        Long id = 10L;
        mockMvc.perform(get(String.format("/todos/%d", id))).andExpect(status().isNotFound())
                .andDo(document("find-todo-wrong"));

    }

}
