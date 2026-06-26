package com.productivity.backend.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
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
    //    GET http://localhost:8081/api/tasks/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskModel>> getTasksByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(taskService.getTasksByUserId(userId));
    }

    // 2. Ambil satu task berdasarkan ID
    //    GET http://localhost:8081/api/tasks/{id}
    @GetMapping("/{id}")
    public ResponseEntity<TaskModel> getTaskById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // 3. Buat task baru (dipanggil dari Modal "Add New Task")
    //    POST http://localhost:8081/api/tasks  (multipart/form-data)
    //    - part "task": JSON berisi field userId, title, course, deadline, description
    //    - part "file": (opsional) dokumen PDF/TXT
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TaskModel> createTask(
            @RequestPart("task") TaskModel task,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(taskService.createTask(task, file));
    }

    // 4. Update task (judul, course, deadline, description, dan opsional ganti/hapus file)
    //    PUT http://localhost:8081/api/tasks/{id}  (multipart/form-data)
    //    - part "task": JSON field yang akan diupdate
    //    - part "file": (opsional) file pengganti
    //    - query "removeFile": true kalau mau hapus file eksisting tanpa ganti
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TaskModel> updateTask(
            @PathVariable UUID id,
            @RequestPart("task") TaskModel task,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "removeFile", required = false, defaultValue = "false") boolean removeFile) {
        return ResponseEntity.ok(taskService.updateTask(id, task, file, removeFile));
    }

    // 5. Toggle status completed (tombol check/uncheck lingkaran)
    //    PATCH http://localhost:8081/api/tasks/{id}/toggle
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskModel> toggleTask(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.toggleTask(id));
    }

    // 6. Hapus task (tombol tong sampah) — file attachment juga ikut terhapus
    //    DELETE http://localhost:8081/api/tasks/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("message", "Task berhasil dihapus"));
    }

    // 7. Download file attachment dari sebuah task
    //    GET http://localhost:8081/api/tasks/{id}/attachment
    //    Memakai Content-Disposition: attachment agar browser langsung mendownload.
    @GetMapping("/{id}/attachment")
    public ResponseEntity<UrlResource> downloadAttachment(@PathVariable UUID id) {
        TaskModel task = taskService.getTaskById(id);
        if (!task.hasAttachment()) {
            return ResponseEntity.notFound().build();
        }

        Path filePath = taskService.getAttachmentPath(task.getAttachmentStoredName());
        try {
            UrlResource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = task.getAttachmentContentType() != null
                    ? task.getAttachmentContentType()
                    : MediaType.APPLICATION_OCTET_STREAM_VALUE;

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + task.getAttachmentOriginalName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 8. Hapus file attachment saja (task tetap ada)
    //    DELETE http://localhost:8081/api/tasks/{id}/attachment
    @DeleteMapping("/{id}/attachment")
    public ResponseEntity<TaskModel> removeAttachment(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.removeAttachmentOnly(id));
    }
}
