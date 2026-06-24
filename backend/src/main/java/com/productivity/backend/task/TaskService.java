package com.productivity.backend.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class TaskService {

    @Autowired
    private TaskRepositories taskRepository;

    // Folder penyimpanan file upload (relatif terhadap working dir backend).
    // Default: uploads/tasks. Bisa di-override via application.properties.
    @Value("${app.upload.dir:uploads/tasks}")
    private String uploadDir;

    // Ekstensi & content-type yang diizinkan untuk upload dokumen task.
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "txt");
    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("application/pdf", "text/plain");

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

    // 3. Buat task baru (file opsional, bisa null)
    public TaskModel createTask(TaskModel task, MultipartFile file) {
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
        // Handle attachment jika ada
        if (file != null && !file.isEmpty()) {
            attachFile(task, file);
        }
        return enrichWithPriority(taskRepository.save(task));
    }

    // 4. Update task (field-field utama + opsional ganti/hapus file)
    //    CATATAN: completed TIDAK diubah di sini. completed hanya via toggleTask.
    public TaskModel updateTask(UUID id, TaskModel updated, MultipartFile file, boolean removeFile) {
        TaskModel existing = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task dengan ID " + id + " tidak ditemukan"));

        // Update field-field utama dari request body
        if (updated.getTitle() != null && !updated.getTitle().isBlank()) {
            existing.setTitle(updated.getTitle());
        }
        existing.setCourse(updated.getCourse());
        if (updated.getDeadline() != null) {
            existing.setDeadline(updated.getDeadline());
        }
        existing.setDescription(updated.getDescription());

        // Handle file attachment sesuai permintaan
        if (removeFile) {
            // User explicit minta hapus file yang ada
            removeAttachment(existing);
        } else if (file != null && !file.isEmpty()) {
            // User upload file baru → hapus file lama (jika ada), simpan yang baru
            removeAttachment(existing);
            attachFile(existing, file);
        }
        // Jika removeFile=false dan file=null → biarkan file lama tetap ada

        return enrichWithPriority(taskRepository.save(existing));
    }

    // 5. Toggle status completed (untuk tombol check/uncheck di frontend)
    public TaskModel toggleTask(UUID id) {
        TaskModel task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task dengan ID " + id + " tidak ditemukan"));
        task.setCompleted(!task.isCompleted());
        return enrichWithPriority(taskRepository.save(task));
    }

    // 6. Hapus task beserta file attachment-nya (jika ada)
    public void deleteTask(UUID id) {
        TaskModel task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task dengan ID " + id + " tidak ditemukan"));
        removeAttachment(task);
        taskRepository.delete(task);
    }

    // 7. Hanya hapus file attachment, task tetap ada
    public TaskModel removeAttachmentOnly(UUID id) {
        TaskModel task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task dengan ID " + id + " tidak ditemukan"));
        removeAttachment(task);
        return enrichWithPriority(taskRepository.save(task));
    }

    // ========================================================================
    // Helper storage
    // ========================================================================

    // Validasi tipe file (ekstensi + content-type) lalu simpan ke disk
    private void attachFile(TaskModel task, MultipartFile file) {
        validateFileType(file);

        String originalName = file.getOriginalFilename();
        String extension = getExtension(originalName);
        String storedName = UUID.randomUUID() + "." + extension;

        try {
            Path targetDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);
            Path target = targetDir.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Gagal menyimpan file: " + e.getMessage(), e);
        }

        task.setAttachmentOriginalName(originalName);
        task.setAttachmentStoredName(storedName);
        task.setAttachmentContentType(file.getContentType());
        task.setAttachmentSize(file.getSize());
    }

    // Hapus file dari disk + clear metadata di entity
    private void removeAttachment(TaskModel task) {
        if (!task.hasAttachment()) {
            return;
        }
        try {
            Path file = getAttachmentPath(task.getAttachmentStoredName());
            Files.deleteIfExists(file);
        } catch (IOException e) {
            // File hilang dari disk bukan masalah fatal; tetap clear metadata
            System.err.println("Gagal menghapus file " + task.getAttachmentStoredName() + ": " + e.getMessage());
        }
        task.setAttachmentOriginalName(null);
        task.setAttachmentStoredName(null);
        task.setAttachmentContentType(null);
        task.setAttachmentSize(null);
    }

    // Path absolut file di disk (untuk streaming download di controller)
    public Path getAttachmentPath(String storedName) {
        return Paths.get(uploadDir).toAbsolutePath().normalize().resolve(storedName);
    }

    // Validasi: harus PDF atau TXT (cek ekstensi DAN content-type)
    private void validateFileType(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        String extension = getExtension(originalName);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new RuntimeException("Tipe file tidak diizinkan. Hanya PDF atau TXT yang diterima.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new RuntimeException("Content-type tidak valid. Hanya PDF atau TXT yang diterima.");
        }
    }

    // Ambil ekstensi file (tanpa titik, lowercase). Null/empty jika tidak ada.
    private String getExtension(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) return "";
        return filename.substring(dot + 1).toLowerCase();
    }

    // ========================================================================
    // Helper: hitung prioritas secara dinamis dari deadline.
    // Logikanya sama dengan calculatePriority() di Frontend/src/utils/dateUtils.ts:
    // - <= 24 jam -> high (WAKTU AKAN HABIS)
    // - <= 72 jam -> medium (WAKTU DEKAT)
    // - > 72 jam -> low (WAKTU SANTAI)
    // Server sebagai single source of truth supaya prioritas tidak basi.
    // ========================================================================
    private TaskModel enrichWithPriority(TaskModel task) {
        if (task == null)
            return null;
        task.setPriority(calculatePriority(task.getDeadline()));
        return task;
    }

    private String calculatePriority(ZonedDateTime deadline) {
        if (deadline == null)
            return "low";
        long diffHours = Duration.between(ZonedDateTime.now(), deadline).toHours();
        if (diffHours <= 24)
            return "high";
        if (diffHours <= 72)
            return "medium";
        return "low";
    }
}
