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

public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskModel>> getTasksByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(taskService.getTasksByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskModel> getTaskById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TaskModel> createTask(
            @RequestPart("task") TaskModel task,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(taskService.createTask(task, file));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TaskModel> updateTask(
            @PathVariable UUID id,
            @RequestPart("task") TaskModel task,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "removeFile", required = false, defaultValue = "false") boolean removeFile) {
        return ResponseEntity.ok(taskService.updateTask(id, task, file, removeFile));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskModel> toggleTask(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.toggleTask(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("message", "Task berhasil dihapus"));
    }

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

    @DeleteMapping("/{id}/attachment")
    public ResponseEntity<TaskModel> removeAttachment(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.removeAttachmentOnly(id));
    }
}
