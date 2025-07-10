package com.gupiluan.to_do_backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.gupiluan.to_do_backend.model.Priority;
import com.gupiluan.to_do_backend.model.ToDo;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class to verify thread safety of the ToDoRepository.
 */
public class ThreadSafetyTest {

    private ToDoRepository repository;

    @BeforeEach
    void setUp() {
        repository = new ToDoRepository();
    }

    @Test
    void testConcurrentWriteOperations() throws InterruptedException {
        int threadCount = 10;
        int itemsPerThread = 100;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);

        // Create concurrent write operations
        for (int i = 0; i < threadCount; i++) {
            final int threadId = i;
            executor.submit(() -> {
                try {
                    for (int j = 0; j < itemsPerThread; j++) {
                        ToDo todo = new ToDo();
                        todo.setText("Thread " + threadId + " - ToDo " + j);
                        todo.setPriority(Priority.MEDIUM);
                        todo.setCreationTime(LocalDateTime.now());

                        repository.save(todo);
                        successCount.incrementAndGet();
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        // Wait for all threads to complete
        latch.await();
        executor.shutdown();

        // Verify all items were saved
        List<ToDo> allItems = repository.findAll();
        assertEquals(threadCount * itemsPerThread, allItems.size());
        assertEquals(threadCount * itemsPerThread, successCount.get());

        // Verify all IDs are unique (no race conditions in ID generation)
        long uniqueIds = allItems.stream().mapToLong(ToDo::getId).distinct().count();
        assertEquals(allItems.size(), uniqueIds);

        System.out.println("Thread safety test passed!");
        System.out.println("Total items created: " + allItems.size());
        System.out.println("Unique IDs: " + uniqueIds);
    }

    @Test
    void testConcurrentReadWriteOperations() throws InterruptedException {
        // Pre-populate with some data
        for (int i = 0; i < 50; i++) {
            ToDo todo = new ToDo();
            todo.setText("Initial ToDo " + i);
            todo.setPriority(Priority.HIGH);
            todo.setCreationTime(LocalDateTime.now());
            repository.save(todo);
        }

        int readerThreads = 5;
        int writerThreads = 3;
        ExecutorService executor = Executors.newFixedThreadPool(readerThreads + writerThreads);
        CountDownLatch latch = new CountDownLatch(readerThreads + writerThreads);
        AtomicInteger readOperations = new AtomicInteger(0);
        AtomicInteger writeOperations = new AtomicInteger(0);

        // Create reader threads
        for (int i = 0; i < readerThreads; i++) {
            executor.submit(() -> {
                try {
                    for (int j = 0; j < 100; j++) {
                        repository.findAll();
                        repository.findByPriority(Priority.HIGH);
                        readOperations.incrementAndGet();
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        // Create writer threads
        for (int i = 0; i < writerThreads; i++) {
            final int threadId = i;
            executor.submit(() -> {
                try {
                    for (int j = 0; j < 50; j++) {
                        ToDo todo = new ToDo();
                        todo.setText("Concurrent ToDo " + threadId + "-" + j);
                        todo.setPriority(Priority.LOW);
                        todo.setCreationTime(LocalDateTime.now());
                        repository.save(todo);
                        writeOperations.incrementAndGet();
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        // Wait for all threads to complete
        latch.await();
        executor.shutdown();

        // Verify operations completed successfully
        assertTrue(readOperations.get() > 0);
        assertTrue(writeOperations.get() > 0);

        // Verify final state is consistent
        List<ToDo> finalItems = repository.findAll();
        assertEquals(50 + (writerThreads * 50), finalItems.size());

        System.out.println("Concurrent read/write test passed!");
        System.out.println("Read operations: " + readOperations.get());
        System.out.println("Write operations: " + writeOperations.get());
        System.out.println("Final item count: " + finalItems.size());
    }
}
