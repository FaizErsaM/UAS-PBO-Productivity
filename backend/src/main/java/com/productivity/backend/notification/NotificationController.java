package com.productivity.backend.notification;

import com.productivity.backend.task.TaskRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Endpoint dev/diagnostik untuk fitur notifikasi email.
 *
 * - POST  /api/notifications/test-email/{taskId}?type=approaching|overdue
 *   Kirim email test BYPASS guard (tidak peduli emailDigestEnabled / alreadyNotified).
 *   Dipakai untuk verifikasi SMTP cepat tanpa nunggu scheduler.
 *
 * - DELETE /api/notifications/log/{taskId}
 *   Hapus notification log untuk task supaya bisa re-test scheduler path.
 *
 * NOTE: endpoint ini tidak ganti fungsi scheduler. Scheduler tetap hormati guard
 * via NotificationService.sendDeadlineApproachingIfNeeded / sendDeadlineOverdueIfNeeded.
 */
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173") // Supaya kodingan Frontend TypeScript gak kena CORS error saat manggil backend
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TaskRepositories taskRepository;

    /**
     * Test kirim email approaching/overdue untuk task tertentu. Bypass guard.
     *
     * Response 200 dengan body:
     *   { "sent": true/false, "recipient": "...", "subject": "...", "error": "..." (opsional) }
     */
    @PostMapping("/test-email/{taskId}")
    public ResponseEntity<Map<String, Object>> testEmail(
            @PathVariable UUID taskId,
            @RequestParam(value = "type", defaultValue = "approaching") String type) {

        if (!taskRepository.existsById(taskId)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "sent", false,
                    "error", "Task tidak ditemukan: " + taskId
            ));
        }

        boolean overdue = "overdue".equalsIgnoreCase(type);
        Map<String, Object> result = notificationService.sendTestEmail(taskId, overdue);
        return ResponseEntity.ok(result);
    }

    /**
     * Hapus notification log untuk task (biar bisa re-test).
     */
    @DeleteMapping("/log/{taskId}")
    public ResponseEntity<Map<String, Object>> clearLog(@PathVariable UUID taskId) {
        int deleted = notificationService.clearNotificationLog(taskId);
        return ResponseEntity.ok(Map.of(
                "taskId", taskId,
                "deleted", deleted
        ));
    }
}
