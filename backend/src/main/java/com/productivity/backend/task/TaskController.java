package com.productivity.backend.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173") // Supaya kodingan Frontend TypeScript gak kena CORS error saat manggil backend
public class TaskController {

    @Autowired
    private TaskService taskService;

    // 1. Ambil semua task milik user (untuk merender TasksView)
    //    GET http://localhost:8080/api/tasks/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskModel>> getTasksByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(taskService.getTasksByUserId(userId));
    }

    // 2. Ambil satu task berdasarkan ID
    //    GET http://localhost:8080/api/tasks/{id}
    @GetMapping("/{id}")
    public ResponseEntity<TaskModel> getTaskById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // 3. Buat task baru (dipanggil dari Modal "Add New Task")
    //    POST http://localhost:8080/api/tasks
    //    Body: { "userId": "...", "title": "...", "course": "...", "deadline": "2026-06-18T10:00:00Z" }
    @PostMapping
    public ResponseEntity<TaskModel> createTask(@RequestBody TaskModel task) {
        return ResponseEntity.ok(taskService.createTask(task));
    }

    // 4. Update task (misal ganti deadline / judul)
    //    PUT http://localhost:8080/api/tasks/{id}
    @PutMapping("/{id}")
    public ResponseEntity<TaskModel> updateTask(@PathVariable UUID id, @RequestBody TaskModel task) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    // 5. Toggle status completed (tombol check/uncheck lingkaran)
    //    PATCH http://localhost:8080/api/tasks/{id}/toggle
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskModel> toggleTask(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.toggleTask(id));
    }

    // 6. Hapus task (tombol tong sampah)
    //    DELETE http://localhost:8080/api/tasks/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("message", "Task berhasil dihapus"));
    }
}
