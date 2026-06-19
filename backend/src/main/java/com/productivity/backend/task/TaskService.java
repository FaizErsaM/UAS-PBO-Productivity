package com.productivity.backend.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    @Autowired
    private TaskRepositories taskRepository;

    // 1. Ambil semua task milik user
    public List<TaskModel> getTasksByUserId(UUID userId) {
        return taskRepository.findByUserId(userId)
                .stream()
                .map(this::enrichWithPriority)
                .toList();
    }

    // 2. Ambil satu task berdasarkan ID
    public TaskModel getTaskById(UUID id) {
        return enrichWithPriority(taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task dengan ID " + id + " tidak ditemukan")));
    }

    // 3. Buat task baru
    public TaskModel createTask(TaskModel task) {
        if (task.getUserId() == null) {
            throw new RuntimeException("userId wajib diisi");
        }
        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new RuntimeException("title wajib diisi");
        }
        if (task.getDeadline() == null) {
            throw new RuntimeException("deadline wajib diisi");
        }
        // Pastikan task baru selalu belum selesai & punya list materials (bukan null)
        task.setCompleted(false);
        if (task.getAiMaterials() == null) {
            task.setAiMaterials(new java.util.ArrayList<>());
        }
        return enrichWithPriority(taskRepository.save(task));
    }

    // 4. Update task (full replace field-field utama)
    public TaskModel updateTask(UUID id, TaskModel updated) {
        TaskModel existing = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task dengan ID " + id + " tidak ditemukan"));

        existing.setTitle(updated.getTitle());
        existing.setCourse(updated.getCourse());
        existing.setDeadline(updated.getDeadline());
        if (updated.isCompleted()) {
            existing.setCompleted(true);
        } else {
            existing.setCompleted(false);
        }
        if (updated.getAiMaterials() != null) {
            existing.setAiMaterials(updated.getAiMaterials());
        }

        return enrichWithPriority(taskRepository.save(existing));
    }

    // 5. Toggle status completed (untuk tombol check/uncheck di frontend)
    public TaskModel toggleTask(UUID id) {
        TaskModel task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task dengan ID " + id + " tidak ditemukan"));
        task.setCompleted(!task.isCompleted());
        return enrichWithPriority(taskRepository.save(task));
    }

    // 6. Hapus task
    public void deleteTask(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task dengan ID " + id + " tidak ditemukan");
        }
        taskRepository.deleteById(id);
    }

    // ========================================================================
    // Helper: hitung prioritas secara dinamis dari deadline.
    // Logikanya sama dengan calculatePriority() di Frontend/src/utils/dateUtils.ts:
    //   - <= 24 jam -> high   (WAKTU AKAN HABIS)
    //   - <= 72 jam -> medium (WAKTU DEKAT)
    //   -  > 72 jam -> low    (WAKTU SANTAI)
    // Server sebagai single source of truth supaya prioritas tidak basi.
    // ========================================================================
    private TaskModel enrichWithPriority(TaskModel task) {
        if (task == null) return null;
        task.setPriority(calculatePriority(task.getDeadline()));
        return task;
    }

    private String calculatePriority(ZonedDateTime deadline) {
        if (deadline == null) return "low";
        long diffHours = Duration.between(ZonedDateTime.now(), deadline).toHours();
        if (diffHours <= 24) return "high";
        if (diffHours <= 72) return "medium";
        return "low";
    }
}
