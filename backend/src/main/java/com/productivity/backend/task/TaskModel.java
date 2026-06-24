package com.productivity.backend.task;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tasks", schema = "public")
@Data // Otomatis membuatkan semua Getter dan Setter
@NoArgsConstructor // Otomatis membuatkan constructor kosong
public class TaskModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "course", length = 255)
    private String course;

    @Column(name = "deadline", nullable = false)
    private ZonedDateTime deadline;

    @Column(name = "completed", nullable = false)
    private boolean completed = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;

    // Deskripsi task (catatan/keterangan panjang dari user)
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Metadata dokumen yang di-upload user (PDF/TXT). Semua nullable.
    // Jika attachmentStoredName == null berarti task tidak punya file.
    @Column(name = "attachment_original_name", length = 255)
    private String attachmentOriginalName;

    @Column(name = "attachment_stored_name", length = 255)
    private String attachmentStoredName;

    @Column(name = "attachment_content_type", length = 100)
    private String attachmentContentType;

    @Column(name = "attachment_size")
    private Long attachmentSize;

    // Material AI (link YouTube, PDF, dll) disimpan sebagai JSONB di Postgres
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "ai_materials", columnDefinition = "jsonb")
    private List<AiMaterial> aiMaterials = new ArrayList<>();

    // Dihitung dinamis dari deadline vs waktu sekarang, TIDAK disimpan di DB.
    // Untuk response API saja (sesuai ekspektasi frontend Task interface).
    @Transient
    private String priority;

    public TaskModel(UUID userId, String title, String course, ZonedDateTime deadline) {
        this.userId = userId;
        this.title = title;
        this.course = course;
        this.deadline = deadline;
        this.completed = false;
    }

    // Helper: apakah task ini punya dokumen attachment?
    public boolean hasAttachment() {
        return attachmentStoredName != null && !attachmentStoredName.isBlank();
    }

    // Record untuk satu item material AI (disimpan dalam kolom jsonb)
    public record AiMaterial(String title, String type, String link) {}
}
