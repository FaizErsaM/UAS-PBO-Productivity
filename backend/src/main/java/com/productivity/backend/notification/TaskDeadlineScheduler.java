package com.productivity.backend.notification;

import com.productivity.backend.task.TaskModel;
import com.productivity.backend.task.TaskRepositories;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Scheduler yang berjalan periodik untuk mengirim email notifikasi deadline.
 *
 * Ada 2 job:
 *   1. checkDeadlineApproaching — tiap 1 jam, cari task yang deadline-nya
 *      dalam X jam ke depan (default 24h) & belum selesai. Kirim email reminder.
 *   2. checkDeadlineOverdue — tiap 1 jam, cari task yang deadline-nya sudah
 *      lewat & belum selesai. Kirim email peringatan keterlambatan.
 *
 * Anti-spam ditangani NotificationService lewat NotificationLog — setiap
 * (task, event) hanya dikirim sekali sepanjang masa hidup task.
 */
@Component
public class TaskDeadlineScheduler {

    private static final Logger log = LoggerFactory.getLogger(TaskDeadlineScheduler.class);

    @Autowired
    private TaskRepositories taskRepository;

    @Autowired
    private NotificationService notificationService;

    /** Berapa jam sebelum deadline mulai mengirim reminder. Default 24. */
    @Value("${app.notification.deadline-reminder-hours:24}")
    private long reminderHours;

    /**
     * Tiap 1 jam (pada detik 0 menit 0). Cari task mendekati deadline.
     * fixedRate alternative: tiap 1 jam dari startup. Untuk dev, bisa
     * di-override pakai expression jika mau jalan lebih sering.
     */
    @Scheduled(cron = "0 0 * * * *")
    public void checkDeadlineApproaching() {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime cutoff = now.plusHours(reminderHours);

        List<TaskModel> tasks = taskRepository.findByCompletedFalseAndDeadlineBetween(now, cutoff);
        if (tasks.isEmpty()) {
            return;
        }
        log.info("[Scheduler] Cek deadline mendekati: {} kandidat task", tasks.size());

        int sent = 0;
        for (TaskModel task : tasks) {
            try {
                notificationService.sendDeadlineApproachingIfNeeded(task);
                sent++;
            } catch (Exception e) {
                log.error("Error kirim reminder untuk task {}: {}", task.getId(), e.getMessage());
            }
        }
        log.info("[Scheduler] Reminder mendekati deadline selesai. {} task diproses.", sent);
    }

    /**
     * Tiap 1 jam (pada detik 30 menit 0, sedikit offset biar tidak bareng
     * job di atas). Cari task yang deadline-nya sudah lewat.
     */
    @Scheduled(cron = "0 30 * * * *")
    public void checkDeadlineOverdue() {
        ZonedDateTime now = ZonedDateTime.now();

        List<TaskModel> tasks = taskRepository.findByCompletedFalseAndDeadlineBefore(now);
        if (tasks.isEmpty()) {
            return;
        }
        log.info("[Scheduler] Cek deadline terlewat: {} kandidat task", tasks.size());

        int sent = 0;
        for (TaskModel task : tasks) {
            try {
                notificationService.sendDeadlineOverdueIfNeeded(task);
                sent++;
            } catch (Exception e) {
                log.error("Error kirim overdue untuk task {}: {}", task.getId(), e.getMessage());
            }
        }
        log.info("[Scheduler] Peringatan terlewat selesai. {} task diproses.", sent);
    }
}
