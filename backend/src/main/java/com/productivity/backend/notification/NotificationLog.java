package com.productivity.backend.notification;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

/**
 * Catatan bahwa email notifikasi sudah pernah dikirim untuk task + event tertentu.
 * Unique constraint (task_id, event_type) memastikan satu task hanya dapat
 * satu email per jenis event — anti-spam.
 */
@Entity
@Table(
    name = "notification_logs",
    schema = "public",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_notif_task_event",
        columnNames = {"task_id", "event_type"}
    )
)
public class NotificationLog {

    /** Jenis event notifikasi. */
    public static final String EVENT_DEADLINE_APPROACHING = "DEADLINE_APPROACHING";
    public static final String EVENT_DEADLINE_OVERDUE = "DEADLINE_OVERDUE";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "task_id", nullable = false)
    private UUID taskId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /** DEADLINE_APPROACHING atau DEADLINE_OVERDUE */
    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "sent_at", insertable = false, updatable = false)
    private ZonedDateTime sentAt;

    // Constructors
    public NotificationLog() {}

    public NotificationLog(UUID taskId, UUID userId, String eventType) {
        this.taskId = taskId;
        this.userId = userId;
        this.eventType = eventType;
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTaskId() { return taskId; }
    public void setTaskId(UUID taskId) { this.taskId = taskId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public ZonedDateTime getSentAt() { return sentAt; }
    public void setSentAt(ZonedDateTime sentAt) { this.sentAt = sentAt; }
}
