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

import java.time.LocalDateTime;

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

        @Test
        @Order(5)
        public void getAllFromPageOne() throws Exception {
                mockMvc.perform(get("/todos")
                                .param("page", "0")
                                .param("size", "10"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("message").value("success"))
                                .andDo(document("findall-todo-content"));

        }

        @Test
        @Order(6)
        public void getAllFromPageTwo() throws Exception {
                mockMvc.perform(get("/todos")
                                .param("page", "1")
                                .param("size", "10"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("message").value("empty"))
                                .andDo(document("findall-todo-empty"));
        }

        @Test
        @Order(7)
        public void updateToDoPass() throws Exception {
                String tomorrow = LocalDateTime.now().plusDays(1).toString();
                String toDoJSON = String.format("{\n" + //
                                "    \"text\" : \"test\",\n" + //
                                "    \"priority\" : \"HIGH\",\n" + //
                                "    \"dueDate\" : \"%s\"\n" + //
                                "}", tomorrow);

                mockMvc.perform(put("/todos/1").contentType(MediaType.APPLICATION_JSON)
                                .content(toDoJSON))
                                .andExpect(status().isOk()).andDo(document("update-todo-pass"));

        }

        @Test
        @Order(8)
        public void updateToDoError() throws Exception {
                String tomorrow = LocalDateTime.now().plusDays(1).toString();
                String toDoJSON = String.format("{\n" + //
                                "    \"text\" : \"test\",\n" + //
                                "    \"dueDate\" : \"%s\"\n" + //
                                "}", tomorrow);

                mockMvc.perform(put("/todos/1").contentType(MediaType.APPLICATION_JSON)
                                .content(toDoJSON))
                                .andExpect(status().isBadRequest()).andDo(document("update-todo-error"));

        }

        @Test
        @Order(9)
        public void markDone() throws Exception {
                mockMvc.perform(post("/todos/1/done"))
                                .andExpect(status().isOk()).andDo(document("markdone-todo"));

        }

        @Test
        @Order(10)
        public void stats() throws Exception {
                mockMvc.perform(get("/todos/stats"))
                                .andExpect(status().isOk()).andDo(document("stats-todo"));

        }

        @Test
        @Order(11)
        public void markUnDone() throws Exception {
                mockMvc.perform(put("/todos/1/undone"))
                                .andExpect(status().isOk()).andDo(document("markundone-todo"));

        }

        @Test
        @Order(12)
        public void deleteToDo() throws Exception {
                mockMvc.perform(delete("/todos/1")).andExpect(status().isOk()).andDo(document("delete-todo"));
        }

        @Test
        @Order(13)
        public void deleteToDoNonExisting() throws Exception {
                mockMvc.perform(delete("/todos/2")).andExpect(status().isBadRequest()).andDo(document("delete-todo"));
        }

}
