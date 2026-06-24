package com.productivity.backend.notification;

import com.productivity.backend.settings.SettingModel;
import com.productivity.backend.settings.SettingRepository;
import com.productivity.backend.task.TaskModel;
import com.productivity.backend.user.User;
import com.productivity.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

/**
 * Service untuk mengirim email notifikasi deadline (mendekati & terlewat).
 * Anti-spam: setiap (taskId, eventType) hanya boleh dikirim sekali,
 * ditrack lewat NotificationLog.
 *
 * Preferensi user: email hanya dikirim jika SettingModel.emailDigestEnabled == true.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private static final DateTimeFormatter DEADLINE_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm z").withZone(ZoneId.systemDefault());

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private NotificationLogRepository notificationLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SettingRepository settingRepository;

    @Value("${app.mail.from:noreply@productivity.local}")
    private String mailFrom;

    @Value("${app.mail.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Cek apakah user pantas menerima email notifikasi:
     * - punya setting
     * - emailDigestEnabled == true (default false kalau null)
     */
    public boolean isEmailNotificationEnabled(UUID userId) {
        return settingRepository.findByUserId(userId)
                .map(setting -> Boolean.TRUE.equals(setting.getEmailDigestEnabled()))
                .orElse(false);
    }

    /** Sudah pernah dikirim email (taskId, eventType)? */
    public boolean alreadyNotified(UUID taskId, String eventType) {
        return notificationLogRepository.existsByTaskIdAndEventType(taskId, eventType);
    }

    /**
     * Kirim email "mendekati deadline" jika:
     * - user mengaktifkan notifikasi email
     * - belum pernah dikirim untuk task+event ini
     */
    public void sendDeadlineApproachingIfNeeded(TaskModel task) {
        if (!isEmailNotificationEnabled(task.getUserId())) {
            return;
        }
        if (alreadyNotified(task.getId(), NotificationLog.EVENT_DEADLINE_APPROACHING)) {
            return;
        }
        Optional<User> userOpt = userRepository.findById(task.getUserId());
        if (userOpt.isEmpty() || userOpt.get().getEmail() == null) return;
        User user = userOpt.get();

        String subject = "[Productivity] Deadline mendekati: " + task.getTitle();
        String body = buildApproachingBody(task, user);

        sendMail(user.getEmail(), subject, body);
        markNotified(task, NotificationLog.EVENT_DEADLINE_APPROACHING);
    }

    /**
     * Kirim email "deadline terlewat" jika:
     * - user mengaktifkan notifikasi email
     * - belum pernah dikirim untuk task+event ini
     */
    public void sendDeadlineOverdueIfNeeded(TaskModel task) {
        if (!isEmailNotificationEnabled(task.getUserId())) {
            return;
        }
        if (alreadyNotified(task.getId(), NotificationLog.EVENT_DEADLINE_OVERDUE)) {
            return;
        }
        Optional<User> userOpt = userRepository.findById(task.getUserId());
        if (userOpt.isEmpty() || userOpt.get().getEmail() == null) return;
        User user = userOpt.get();

        String subject = "[Productivity] TERLAMBAT: " + task.getTitle();
        String body = buildOverdueBody(task, user);

        sendMail(user.getEmail(), subject, body);
        markNotified(task, NotificationLog.EVENT_DEADLINE_OVERDUE);
    }

    // ========================================================================
    // Helpers
    // ========================================================================

    private void sendMail(String to, String subject, String body) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailFrom);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Email notifikasi terkirim ke {} | subjek: {}", to, subject);
        } catch (Exception e) {
            // Jangan fail scheduler kalau SMTP bermasalah — hanya log
            log.error("Gagal kirim email ke {}: {}", to, e.getMessage());
        }
    }

    private void markNotified(TaskModel task, String eventType) {
        try {
            notificationLogRepository.save(
                    new NotificationLog(task.getId(), task.getUserId(), eventType));
        } catch (Exception e) {
            // Unique constraint violation boleh diabaikan (race condition antar scheduler tick)
            log.warn("Gagal catat notification log untuk task {} event {}: {}",
                    task.getId(), eventType, e.getMessage());
        }
    }

    private String buildApproachingBody(TaskModel task, User user) {
        String name = (user.getUsername() != null && !user.getUsername().isBlank())
                ? user.getUsername() : "Sahabat";
        String deadlineStr = formatDeadline(task.getDeadline());
        String courseLine = (task.getCourse() != null && !task.getCourse().isBlank())
                ? "Mata Kuliah/Course : " + task.getCourse() + "\n"
                : "";
        String descLine = (task.getDescription() != null && !task.getDescription().isBlank())
                ? "\nCatatan:\n" + task.getDescription() + "\n"
                : "";

        return "Halo " + name + ",\n\n"
                + "Ini pengingat bahwa tugas berikut akan jatuh tempo dalam waktu dekat:\n\n"
                + "Judul       : " + task.getTitle() + "\n"
                + courseLine
                + "Deadline    : " + deadlineStr + "\n"
                + descLine
                + "\nSegera kerjakan sebelum tenggat. Semangat!\n\n"
                + "Buka aplikasi: " + frontendUrl + "\n";
    }

    private String buildOverdueBody(TaskModel task, User user) {
        String name = (user.getUsername() != null && !user.getUsername().isBlank())
                ? user.getUsername() : "Sahabat";
        String deadlineStr = formatDeadline(task.getDeadline());
        String courseLine = (task.getCourse() != null && !task.getCourse().isBlank())
                ? "Mata Kuliah/Course : " + task.getCourse() + "\n"
                : "";

        return "Halo " + name + ",\n\n"
                + "Pemberitahuan: tugas berikut sudah LEWAT tenggat dan belum diselesaikan:\n\n"
                + "Judul       : " + task.getTitle() + "\n"
                + courseLine
                + "Deadline    : " + deadlineStr + " (sudah lewat)\n\n"
                + "Mohon segera kerjakan atau perbarui deadline-nya.\n\n"
                + "Buka aplikasi: " + frontendUrl + "\n";
    }

    private String formatDeadline(java.time.ZonedDateTime deadline) {
        if (deadline == null) return "-";
        return DEADLINE_FMT.format(deadline);
    }
}
